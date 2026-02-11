import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const generateTokens = async (Id) => {
  try {
    const user = await User.findOne(Id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens!"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // inputs: userName, monile, password
  // validation on inputs
  // check: if user exists
  // create user object
  // enter user in db
  // check: if user createed successfully
  // return response with user data

  const { fullName, mobile, password } = req.body;

  if ([fullName, mobile, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  const isExist = await User.findOne({
    $and: [{ fullName }, { mobile }],
  });

  if (isExist) {
    throw new ApiError(409, "User already exist!");
  }

  const user = await User.create({
    fullName,
    mobile,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while creating the user!");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const createUser = await User.findOne(user._id).select(
    "-refreshToken -password"
  );

  if (!createUser) {
    throw new ApiError(500, "Erroe occured while creating new user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: createUser,
          accessToken,
          refreshToken,
        },
        "New user created successfully!"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  // imputs: username, mobile, password
  // validation on inputs
  // check: if user exists
  // validate password
  // generate: JWT tokens(access and refresh)
  // store refresh token in db
  // send response with user info and tokens

  const { mobile, password } = req.body;

  if ([mobile, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Mobile number and password is required!");
  }

  const user = await User.findOne({
    $and: [{ mobile }, { password }],
  });

  if (!user) {
    throw new ApiError(409, "User doesn't exist!");
  }

  const passwordCheck = await user.isPasswordCorrecct(password);

  if (!passwordCheck) {
    throw new ApiError(400, "Incorrect password!");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiResponse(
      500,
      [],
      "Something went wrong while login the user!"
    );
  }

  return res
    .status(200)
    .cookie("accessToke", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loged in successfully!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // inputs: tokens from cookies
  // validte tokens with refresh token from db
  // remove token from db
  // send response

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User loged out successfully!"));
});

const updateAccessAndRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Invalid request!");
  }

  try {
    const validateToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(validateToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token!");
    }

    if (!incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used!");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access and Refresh token updated successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid refresh token!");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if ([fullName, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name and email are required!");
  }

  const user = await User.findOne(
    req.user._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(
      500,
      "Some error occured while updating the profile fields!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User's profile is updated successfully!")
    );
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.boday;

  const user = await User.findById(req.user?._id);

  const validatePassword = await user.isPasswordCorrecct(oldPassword);

  if (!validatePassword) {
    throw new ApiError(400, "Incorrect old password!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password upddated successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateAccessAndRefreshToken,
  updateUserProfile,
  updateUserPassword,
};
