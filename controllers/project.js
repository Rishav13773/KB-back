const User = require("../models/User");
const Project = require("../models/Project");
// const generateUniqueId = require("generate-unique-id");

exports.createProject = async (req, res) => {
  // console.log(req.body);
  try {
    const uid = req.user.id;
    // console.log(typeof uid);
    const { projectName, description, isPrivate } = req.body;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const project_id = projectidgenerateUniqueId();

    console.log("reached");
    const newProject = await new Project({
      projectid: uid,
      projectName,
      description,
      isPrivate,
    }).save();

    res.send({
      project: newProject,
      message: "Project successfully created",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getprojectbyid = (req, res) => {
  console.log("start");
  try {
    const uid = req.params.id;
    console.log("uid : ",uid);
    const user = User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Project.find({ projectid: uid })
      .then((projects) => {
        res.send(projects);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
