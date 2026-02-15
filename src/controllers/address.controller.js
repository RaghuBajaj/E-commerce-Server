import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";

const createAddress = asyncHandler(async (req, res) => {
  // input: address, user id
  // create address obj
  // save in db
  // find user
  // add address id to user's address list
  // return address in response
  const inputAddress = req.body;
  const userId = req.user._id;

  const createAddress = {
    country: inputAddress.country,
    fullName: inputAddress.fullName,
    mobile: inputAddress.mobile,
    addressLine1: inputAddress.addressLine1,
    landmark: inputAddress.landmark,
    pincode: inputAddress.pinCode,
    city: inputAddress.city,
    state: inputAddress.state,
    owner: userId,
  };

  const address = await Address.create(createAddress);

  if (!address) {
    throw new ApiError(500, "Some error occured while creating new address!");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  if (!user.address) {
    user["address"] = [];
  }

  user.address.push(address._id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address created successfully!"));
});

const getAllUserAddress = asyncHandler(async (req, res) => {
  // input: user id
  // find user
  // check all user's address
  // send address in response
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const address = user.address;

  if (!address) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No address is present for that user!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        address,
        "Address of the user is fetched successfully!"
      )
    );
});

const getAddrressById = asyncHandler(async (req, res) => {
  // input: address id
  // find address in db from address id
  // send address in response
  const addressId = req.body;

  if (!addressId) {
    throw new ApiError(400, "Address ID is required!");
  }

  const address = await Address.findById(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address is fetched successfully!"));
});

const updateAddress = asyncHandler(async (req, res) => {
  // input: address objest, address id
  // find address in db from address id
  // update address fields
  // save address
  // send address in response
  const { addressObj, addressId } = req.body;

  if (addressObj.length() === 0 || !addressId) {
    throw new ApiError(400, "Both address Object and address Id is required!");
  }

  const address = await Address.findById(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found!");
  }

  address.country = addressObj.country;
  address.fullName = addressObj.fullName;
  address.mobile = addressObj.mobile;
  address.addressLine1 = addressObj.addressLine1;
  address.landmark = addressObj.landmark;
  address.pincode = addressObj.pinCode;
  address.city = addressObj.city;
  address.state = addressObj.state;

  await address.save();

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully!"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  // input: address id, user id
  // find user in db from user id
  // remove address id from the user's address list
  // save user
  // find and delete address in db from address id
  // send address in response
  const addressId = req.body;
  const userId = req.user._id;

  if (!addressId) {
    throw new ApiError(400, "Address Id is required!");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  if (!user.address) {
    throw new ApiError(400, "No Address found for User!");
  }

  user.address = user.address.filter((field) => field?._id !== addressId);
  await user.save();

  const address = await Address.findByIdAndDelete(addressId);
  if (!address) {
    throw new ApiError(404, "Address not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address deleted successfully!"));
});

export {
  createAddress,
  getAllUserAddress,
  getAddrressById,
  updateAddress,
  deleteAddress,
};