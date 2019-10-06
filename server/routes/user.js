const router = require("express").Router();
const { User } = require("../db/models");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user || !user.correctPassword(password)) {
      res.status(401).send("Wrong username and/or password");
    } else {
      req.login(user, err => {
        if (err) {
          next(err);
        } else {
          res.json(user);
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password
    });
    req.login(user, err => {
      if (err) {
        next(err);
      } else {
        res.json(user);
      }
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(error);
    }
  }
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  req.user = null;
  res.sendStatus(204);
});

router.get("/auth", (req, res) => {
  if (req.user) {
    const {
      dataValues: { id, name, email }
    } = req.user;
    res.send({
      id,
      name,
      email
    });
  } else {
    res.status(403).send("Not logged in");
  }
});

module.exports = router;
