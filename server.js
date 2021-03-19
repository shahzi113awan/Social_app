const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
const passport = require("passport");


//initialize express
const app = express();
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//connection to db
const db = require("./config/keys").mongoURI;
console.log(db);
mongoose
  .connect(db)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("error in connection" + err);
  });
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//passport config
require("./config/passport")(passport);

//use routes
app.use("/api/users/", users);
app.use("/api/profile/", profile);
app.use("/api/posts/", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is runnig on " + port);
});
