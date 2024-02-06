const User = require("../models/User");
const Project = require("../models/Project");
const Document = require("../models/Document");
// const generateUniqueId = require("generate-unique-id");

exports.createProject = async (req, res) => {
  // console.log(req.body);
  try {
    const uid = req.user.id;
    console.log("user IDi", uid);
    console.log(req.body);

    const { projectName, description, isPrivate } = req.body;

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const project_id = projectidgenerateUniqueId();

    console.log("reached");
    const newProject = await new Project({
      createdBy: uid,
      projectName,
      description,
      isPrivate,
    }).save();

    res.send({
      project: newProject,
      message: "Project successfully created",
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getprojectbyid = (req, res) => {
  // console.log("start");
  try {
    const uid = req.params.id;
    const state = req.query.state;
    // console.log(state);
    const user = User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("project Id: ", req.params )
    if (state) {
      Project.find({ createdBy: uid, trash: state })
        .then((projects) => {
          res.send(projects);
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      Project.find({ createdBy: uid, trash: state })
        .then((projects) => {
          res.send(projects);
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getdocumentByPid = (req, res) => {
  console.log("Started");
  try {
    const pid = req.params.id;
    console.log(pid);

    Document.find({ project: pid })
      .then((docs) => {
        console.log(docs);
        res.send(docs);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trashProject = async (req, res) => {
  try {
    const pid = req.params.id;
    const state = req.body.state;

    const project = await Project.findByIdAndUpdate(pid, { trash: state });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("reached");
    res.json({ message: "Project trashed", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.restoreProject = async (req, res) => {
  try {
    const pid = req.params.id;
    const state = req.body.state;

    const project = await Project.findByIdAndUpdate(pid, { trash: state });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("reached");
    res.json({ message: "Project trashed", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deletProject = async (req, res) => {
  console.log("reached");
  try {
    const pid = req.params.id;
    console.log("Deleting project with ID:", pid);
    const project = await Project.findByIdAndDelete(pid);
    console.log("Deleted project:", project);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.starredProject = async (req, res) => {
  try {
    const pid = req.params.id;
    const state = req.body.star;

    const starred = await Project.findByIdAndUpdate(pid, { starred: state });

    res.json({ message: "Project Starred successfully", project: starred });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
