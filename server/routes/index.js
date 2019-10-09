const router = require("express").Router();

router.use("/user", require("./users"));
router.use("/transaction", require("./transactions"));
router.use("/suggestions", require("./suggestions"));

router.use((req, res, next) => {
  const error = new Error("Request Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
