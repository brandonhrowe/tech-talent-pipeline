const router = require("express").Router();
const { Transaction, User } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(403).send("You must be logged in to access this route");
    } else {
      const { id: userId } = req.user;
      const transactions = await Transaction.findAll({
        where: {
          userId
        }
      });
      res.json(transactions);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.user.balance, req.body.originalPrice);
    if (!req.user) {
      res.status(403).send("You must be logged in to access this route");
    } else if (
      req.user.balance <
      (req.body.originalPrice / 100) * req.body.quantity
    ) {
      res
        .status(403)
        .send("Sorry, you do not have enough money to buy this stock");
    } else {
      const { id } = req.user;
      const user = await User.findByPk(id);
      const { symbol, quantity, originalPrice } = req.body;
      const transaction = await Transaction.create({
        symbol,
        quantity,
        originalPrice
      });
      await transaction.setUser(user);
      const newBalance =
        user.balance - (transaction.originalPrice / 100) * transaction.quantity;
      await user.update({
        balance: newBalance
      });
      res.status(201).json(transaction);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
