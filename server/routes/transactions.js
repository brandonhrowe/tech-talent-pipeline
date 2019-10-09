const router = require("express").Router();
const { Transaction, User } = require("../db/models");
const fetch = require("node-fetch");

router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(403).send("You must be logged in to access this route");
    } else {
      const { id: userId } = req.user;
      // Find all transactions for the current user
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
      // Pull symbol and quantity from request body
      const { symbol, quantity } = req.body;
      // Call AlphaVantage with the symbol to check latest value of stock
      const alphaData = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
      );
      const newData = await alphaData.json();
      // If symbol is not found from AlphaVantage, throw 403 error
      if (newData["Error Message"]) {
        res
          .status(403)
          .send(
            "Sorry, that does not seem to be a valid symbol. Please try again."
          );
      } else {
        // Store the time of the call, which is the key for finding the applicable info
        const lastRefreshed = newData["Meta Data"]["3. Last Refreshed"];
        // Store the price of the stock upon buy, multiplying by 100 to store it in the database consistently with the balances
        const originalPrice = Math.floor(
          newData["Time Series (60min)"][lastRefreshed]["4. close"] * 100
        );
        const originalOpen = Math.floor(
          newData["Time Series (60min)"][lastRefreshed]["1. open"] * 100
        );
        let originalChange;
        if (originalPrice > originalOpen) {
          originalChange = "positive";
        } else if (originalPrice < originalOpen) {
          originalChange = "negative";
        } else {
          originalChange = "neutral";
        }
        // If user does not have enough in their balance, throw 403 error
        if (req.user.balance < (originalPrice / 100) * req.body.quantity) {
          res
            .status(403)
            .send("Sorry, you do not have enough money to buy this stock");
        } else {
          const { id } = req.user;
          const user = await User.findByPk(id);
          // Otherwise, add transaction to database and associate it with user
          const transaction = await Transaction.create({
            symbol,
            quantity,
            originalPrice,
            originalChange
          });
          await transaction.setUser(user);
          // Update user's balance by subtracting transaction cost
          const newBalance = Math.floor(
            user.balance - transaction.originalPrice * transaction.quantity
          );
          await user.update({
            balance: newBalance
          });
          res.status(201).json(transaction);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

const portfolioHelper = async portfolio => {
  for (let i = 0; i < portfolio.length; i++) {
    // Query daily values for each symbol
    const alphaData = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${portfolio[i].symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
    );
    const newData = await alphaData.json();
    // If an error is thrown, return the last saved value and set change as neutral
    if (newData["Error Message"]) {
      portfolio[i].currentValue = portfolio[i].originalPrice;
      portfolio[i].change = "neutral";
    } else {
      // Retrieve the latest values
      const lastRefreshed = newData["Meta Data"]["3. Last Refreshed"].split(
        " "
      )[0];
      // Define variables for the stock values at the opening and close (latest) of the day
      let closeVal =
        newData["Time Series (Daily)"][lastRefreshed]["4. close"] * 100;
      let openVal =
        newData["Time Series (Daily)"][lastRefreshed]["1. open"] * 100;
      // Store the close value to the object to be sent back
      portfolio[i].currentValue = closeVal;
      // Also store whether the change was positive/negative/neutral based on the opening and close values
      if (closeVal > openVal) {
        portfolio[i].change = "positive";
      } else if (closeVal < openVal) {
        portfolio[i].change = "negative";
      } else {
        portfolio[i].change = "neutral";
      }
    }
  }
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
      let portfolio = [];
      let hashMap = {};
      let prevIdx = 0;
      let newIdx = 0;
      while (prevIdx < transactions.length) {
        let symb = transactions[prevIdx].symbol;
        if (!hashMap[symb] && hashMap[symb] !== 0) {
          hashMap[symb] = newIdx;
          portfolio[newIdx] = {
            symbol: symb,
            quantity: transactions[prevIdx].quantity
          };
          newIdx++;
          prevIdx++;
        } else {
          portfolio[hashMap[symb]].quantity += transactions[prevIdx].quantity;
          prevIdx++;
        }
      }
      // Call helper function to get most up-to-date data
      await portfolioHelper(portfolio);
      // Final array sent out should have symbols and values plus total quantity, latest value, and the polarity of change.
      res.json(portfolio);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
