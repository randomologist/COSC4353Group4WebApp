const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(cors());
app.use(express.json());

const userProfileRoutes = require("./routes/userProfile");
const eventRoutes = require("./routes/events");
const matchingRoutes = require("./routes/matching");

app.use("/api/userProfile", userProfileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/matching", matchingRoutes);

if (process.env.NODE_ENV === "test") { // for test node_env auto == test
  module.exports = app;
} else {
  app.listen(5000, () => console.log("Server running"));
}
