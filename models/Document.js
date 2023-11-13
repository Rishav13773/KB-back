const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const documentSchema = mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL is required"],
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Project ID is required"],
  },
});

mongoose.model("Document", documentSchema);
