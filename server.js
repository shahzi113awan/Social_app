const express = require("express");
const mongoose = require("mongoose");
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
//initialize express
const app = express();
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
//use routes
app.use('/api/users/',users)
app.use('/api/profile/',profile)
app.use('/api/posts/',posts)

app.get("/", (req, res) => {
  res.send("hello");
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is runnig on " + port);
});
