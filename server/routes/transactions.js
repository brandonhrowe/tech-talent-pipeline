const router = require("express").Router();
const { Transaction, User } = require("../db/models");
const fetch = require("node-fetch");

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
    if (!req.user) {
      res.status(403).send("You must be logged in to access this route");
    } else {
      const { symbol, quantity } = req.body;
      const alphaData = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
      );
      const newData = await alphaData.json();
      if (newData["Error Message"]) {
        res
          .status(403)
          .send(
            "Sorry, that does not seem to be a valid symbol. Please try again."
          );
      } else {
        const lastRefreshed = newData["Meta Data"]["3. Last Refreshed"];
        const originalPrice = Math.floor(
          newData["Time Series (60min)"][lastRefreshed]["4. close"] * 100
        );
        if (req.user.balance < (originalPrice / 100) * req.body.quantity) {
          res
            .status(403)
            .send("Sorry, you do not have enough money to buy this stock");
        }
        const { id } = req.user;
        const user = await User.findByPk(id);
        const transaction = await Transaction.create({
          symbol,
          quantity,
          originalPrice
        });
        await transaction.setUser(user);
        const newBalance = Math.floor(
          user.balance - transaction.originalPrice * transaction.quantity
        );
        await user.update({
          balance: newBalance
        });
        res.status(201).json(transaction);
      }
    }
  } catch (error) {
    next(error);
  }
});

const portfolioHelper = async portfolio => {
  for (let key in portfolio) {
    if (portfolio.hasOwnProperty(key)) {
      // Query daily values for each symbol
      const alphaData = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${key}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
      );
      const newData = await alphaData.json();
      // Retrieve the latest values
      const lastRefreshed = newData["Meta Data"]["3. Last Refreshed"].split(
        " "
      )[0];
      // Define variables for the stock values at the opening and close (latest) of the day
      let closeVal = newData["Time Series (Daily)"][lastRefreshed]["4. close"];
      let openVal = newData["Time Series (Daily)"][lastRefreshed]["1. open"];
      // Store the close value to the object to be sent back
      portfolio[key].currentValue = closeVal;
      // Also store whether the change was positive/negative/neutral based on the opening and close values
      if (closeVal > openVal) {
        portfolio[key].change = "positive";
      } else if (closeVal < openVal) {
        portfolio[key].change = "negative";
      } else {
        portfolio[key].change = "neutral";
      }
    }
  }
  return portfolio;
};

router.get("/portfolio", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(403).send("You must be logged in to access this route");
    } else {
      const { id: userId } = req.user;
      // Get all of user's transactions
      const transactions = await Transaction.findAll({
        where: {
          userId
        }
      });
      // Establish a portfolio object to concatenate transactions with the same symbol, and add together the quantity for each
      let portfolio = {};
      for (let key in transactions) {
        if (transactions.hasOwnProperty(key)) {
          let symb = transactions[key].symbol;
          if (!portfolio[symb]) {
            portfolio[symb] = transactions[key];
          } else {
            portfolio[symb] = {
              quantity: transactions[key].quantity + portfolio[symb].quantity
            };
          }
        }
      }
      // Call helper function to get most up-to-date data
      await portfolioHelper(portfolio);
      // Final object sent out should have keys for each symbol and values for each with total quantity, latest value, and the polarity of change.
      res.json(portfolio);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
