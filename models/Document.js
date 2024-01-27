const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  // urls: {
  //   type: [String],
  //   required: [true, "URLs are required"],
  // },
  urls: [
    {
      url: {
        type: String,
        required: [true, "URLs are required"],
      },
      size: {
        type: Number,
      },
      format: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },
  ],

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Project ID is required"],
  },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
