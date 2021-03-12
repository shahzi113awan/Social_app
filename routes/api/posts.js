const express = require("express");
const router = express.Router();

//Get Api
//@desc test post route
//access public

router.get("/test", (req, res) => {
  res.json({ msg: "hello" });
});
module.exports = router;
