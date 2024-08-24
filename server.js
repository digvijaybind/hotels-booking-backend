const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieSession = require("cookie-session");
const OperatorRouter = require("./routes/Operator-Router");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require('./middlerwares/error-middleware');
const dotenv = require('dotenv').config();
require("./database/Database");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "sample-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true,
  })
);

const corsOptions = { origin: `*` };
app.use(cors(corsOptions));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    msg: "Hello from node Server",
    status: "ok",
  });
});





app.use("/operator", OperatorRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(8000, () => {
  console.log("node API app is running on port 8000");
});




