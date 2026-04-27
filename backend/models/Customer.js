const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String 
    },

    phone: { 
      type: String 
    },

    street: { 
      type: String 
    },

    
    state: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "State",
      required: true
    },

    city: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "City",
      required: true
    },

    pincode: { 
      type: String 
    },

    image: { 
      type: String, 
      default: null 
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Customer", customerSchema);