const express = require("express");
const cors = require("cors");
const routes = require("./src/Routes/routes.js");
const adminRoutes = require("./src/Routes/adminRoutes.js")

const app = express();
const port = 3000;

app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", routes);

app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
});
