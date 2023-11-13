const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const projectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    projectid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
