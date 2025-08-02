const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Use .fields() to support listing[image] as file input name
const uploadListingImage = upload.fields([{ name: "listing[image]", maxCount: 1 }]);

// Index and Create
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    uploadListingImage, // supports listing[image]
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, Delete
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    uploadListingImage, // also supports listing[image]
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;