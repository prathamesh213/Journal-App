const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

// Endpoint to handle FormData request
app.post("/upload", upload.array("image", 3), (req, res) => {
  const images = req.files;

  if (!images || images.length === 0) {
    return res.status(200).json({ message: "images" });
  }

  // Extract responses from FormData
  const responses = JSON.parse(req.body.responses);

  // You can handle the images and responses here
  // For now, just logging them
  //   console.log("Uploaded images:", images);
  //   console.log("Responses:", responses);

  try {
    // Move uploaded files to a designated folder
    images.forEach((image) => {
      fs.renameSync(image.path, `uploads/${image.originalname}`);
    });
    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
