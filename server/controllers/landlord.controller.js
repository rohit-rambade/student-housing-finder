import cloudinary from "../config/cloudinaryConfig.js";
import { LandlordProfile } from "../models/landlord.model.js";
import { Listing } from "../models/listing.model.js";
import RentRequest from "../models/rentRequest.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import { getImagePublicIdFromUrl } from "../utils/getImageURL.js";
import { log } from "console";

const createListing = async (req, res) => {
  const { id } = req.user; // Assuming req.user contains the user ID

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    const userDetails = await LandlordProfile.findById(user.details);
    if (!userDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Landlord Profile Not Found" });
    }

    // Handle image upload to Cloudinary
    const { images } = req.body;
    const uploadedImages = [];

    // Loop through each image file
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "SHF",
      });
      uploadedImages.push(result.secure_url);

      // Remove the uploaded file from the server after uploading to Cloudinary
      fs.unlinkSync(file.path);
    }

    const newListingData = {
      ...req.body,
      images: uploadedImages,
      landlord: user._id,
    };

    const newListing = new Listing(newListingData);
    await newListing.save();

    userDetails.listings.push(newListing);
    await userDetails.save();

    res
      .status(201)
      .json({ success: true, message: "Listing Added", listing: newListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateListing = async (req, res) => {
  const { id } = req.user;
  const { listingId } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    const listingToUpdate = await Listing.findById(listingId);
    if (!listingToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Listing Not Found" });
    }
    console.log(listingToUpdate);

    Object.assign(listingToUpdate, req.body);
    await listingToUpdate.save();

    res.status(200).json({ success: true, message: "Listing Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteListing = async (req, res) => {
  const { id } = req.user;
  const { listingId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing Not Found" });
    }

    // Delete images from Cloudinary before deleting the listing
    for (const imageUrl of listing.images) {
      const publicId = getImagePublicIdFromUrl(imageUrl); // Extract public ID from Cloudinary URL
      await cloudinary.uploader.destroy(publicId); // Delete image from Cloudinary
    }

    await Listing.findByIdAndDelete(listingId);
    const userDetails = await LandlordProfile.findById(user.details);
    if (userDetails) {
      userDetails.listings.pull(listingId);
      await userDetails.save();
    }

    res.status(200).json({ success: true, message: "Listing Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getListingsForLandlord = async (req, res) => {
  const { id } = req.user;

  try {
    const listings = await Listing.find({ landlord: id }); // Use find instead of findById

    console.log(listings);
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyAndAcceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // Assuming the status is sent in the request body

    const rentRequest = await RentRequest.findById(requestId);
    if (!rentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Rent request not found" });
    }

    // Verify and update the status based on the value sent from frontend
    rentRequest.status = status; // Assuming status is a valid value like "Approved" or "Rejected"
    await rentRequest.save();

    res.status(200).json({ success: true, message: "Rent request updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markPaymentAsPaid = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the rent request by ID
    const rentRequest = await RentRequest.findById(requestId);
    if (!rentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Rent request not found" });
    }

    // Check if the rent request status is "Approved"
    if (rentRequest.status !== "Approved") {
      return res
        .status(400)
        .json({ success: false, message: "Rent request is not approved" });
    }

    // Mark payment as paid
    rentRequest.paymentStatus = "Paid";
    await rentRequest.save();

    res.status(200).json({ success: true, message: "Payment Status Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const receivedRequests = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    console.log(user.details);

    const landlordProfile = await LandlordProfile.findOne({
      _id: user.details,
    }).populate({
      path: "rentRequests",
      model: "RentRequest",
      populate: {
        path: "student",
        select: "details",
        populate: {
          path: "details",
          model: "StudentProfile",
          select: "",
        },
      },
    });

    console.log(landlordProfile);

    if (!landlordProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Landlord profile not found" });
    }

    const requests = landlordProfile.rentRequests;

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export {
  createListing,
  updateListing,
  deleteListing,
  getListingsForLandlord,
  verifyAndAcceptRequest,
  markPaymentAsPaid,
  receivedRequests,
};
