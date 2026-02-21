import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

const generateTokens = async (Id) => {
  try {
    const user = await User.findById(Id);
    if (!user) {
      throw new ApiError(404, "User not found while generating token!");
    }
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

  const isExist = await User.findOne({ mobile });

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

  const createdUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  if (!createdUser) {
    throw new ApiError(500, "Erroe occured while creating new user!");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
          accessToken,
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

  const user = await User.findOne({ mobile });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const passwordCheck = await user.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(401, "Incorrect password!");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging the user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged in successfully!"
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
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const updateAccessAndRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token missing!");
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

    if (incomingRefreshToken !== user?.refreshToken) {
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
    throw new ApiError(401, "Invalid or expired refresh token!");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if ([fullName, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name and email are required!");
  }

  const user = await User.findByIdAndUpdate(
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
      "An error occured while updating the profile fields!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User's profile is updated successfully!")
    );
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const validatePassword = await user.isPasswordCorrect(oldPassword);

  if (!validatePassword) {
    throw new ApiError(401, "Incorrect old password!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateAccessAndRefreshToken,
  updateUserProfile,
  updateUserPassword,
};