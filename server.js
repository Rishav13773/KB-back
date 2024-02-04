const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const useRouter = require("./routes/user");
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/temp", express.static("temp"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setting routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//connecting DB
mongoose
  .connect(process.env.DATABASE_URL, {
    dbName: "Base-local",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected succesfully"))
  .catch((err) => console.log("Error connecting to database", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
