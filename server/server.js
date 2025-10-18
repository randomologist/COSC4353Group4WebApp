const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(cors());
app.use(express.json());

const userProfileRoutes = require("./routes/userProfile");
const eventRoutes = require("./routes/events");
const matchingRoutes = require("./routes/matching");
const authRoutes = require("./routes/auth");
const notifRoutes = require("./routes/notifs")

app.use("/api/userProfile", userProfileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifs",notifRoutes);

if (process.env.NODE_ENV === "test") { // for test node_env auto == test
  module.exports = app;
} else {
  app.listen(5000, () => console.log("Server running"));
}
