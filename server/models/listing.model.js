import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LandlordProfile",
  },
  images: [String],
  city: String,
  coordinates: {
    type: [Number],
    index: "2dsphere",
    default: [null, null],
  },
  proximityToCampus: Number,
  nearbyPublicTransportation: Boolean,
  roomType: {
    type: String,
    enum: [
      "Single",
      "Double",
      "Triple",
      "Common for 5 to 6 students",
      "Apartment",
    ],
  },
  genderPreferences: {
    type: String,
    enum: ["Male", "Female", "Any"],
  },
  rent: {
    type: Number,
  },
  rentType: {
    type: String,
    enum: ["Monthly", "Based on days", "Weekly"],
  },
  washroomSystem: {
    type: String,
    enum: ["Common", "Separate"],
  },
  cookingFacility: {
    inductionAllowed: Boolean,
  },
  occupancy: Number,
  amenities: {
    withBed: Boolean,
    furniture: {
      type: String,
      enum: ["Furnished", "Unfurnished", "Partially furnished"],
    },
  },
  leaseDuration: {
    type: String,
    enum: ["Month-to-month", "Fixed term (6 months, 1 year)"],
  },
  roomDescription: {
    size: String,
    windowsAndNaturalLight: Boolean,
    flooringType: String,
  },
});
listingSchema.index({ coordinates: "2dsphere" });

export const Listing = mongoose.model("Listing", listingSchema);
