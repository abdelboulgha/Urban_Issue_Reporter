const express = require("express");
const router = express.Router();
const regionController = require("../controllers/regionController");

// Route to create a new autorité
router.post("/region", regionController.createregion);

// Route to get all autorités
router.get("/regions", regionController.getAllregions);

// Route to get an autorité by ID
router.get("/region/:id", regionController.getregionById);

// Route to update an autorité by ID
router.put("/region/:id", regionController.updateregion);

// Route to delete an autorité by ID
router.delete("/region/:id", regionController.deleteregion);

module.exports = router;
