const locationData = require("../data/locationData");

// Get all states (for dropdown)
exports.getAllStates = (req, res) => {
  try {
    const states = Object.keys(locationData).map(stateId => ({
      id: stateId,
      name: locationData[stateId].name
    }));
    
    return res.status(200).json({
      success: true,
      states
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get cities by state ID
exports.getCitiesByState = (req, res) => {
  try {
    const stateId = req.query.stateId;

    if (!stateId) {
      return res.status(400).json({
        success: false,
        message: "stateId is required"
      });
    }

    const stateData = locationData[stateId];

    if (!stateData) {
      return res.status(404).json({
        success: false,
        message: "State not found"
      });
    }

    return res.status(200).json({
      success: true,
      stateId,
      stateName: stateData.name,
      cities: stateData.cities
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};