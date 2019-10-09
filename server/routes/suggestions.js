const router = require("express").Router();
const fetch = require("node-fetch");

router.get("/:text", async (req, res, next) => {
  try {
    const { text } = req.params;
    // Request to AlphaVantage confined to server in order to protect API key
    const alphaData = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${text}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
    );
    const suggestions = await alphaData.json();
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
