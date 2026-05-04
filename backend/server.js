const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const customerRoutes = require("./routes/customerRoutes");
const customerController = require("./controllers/customerController");

const staffRoutes = require("./routes/staffRoutes");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);

app.use("/api/staff", staffRoutes);

app.use('/uploads', express.static('uploads'));

app.use("/api", locationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});