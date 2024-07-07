const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set the view engine to ejs
app.set("view engine", "ejs");

// Serve static files (e.g., CSS) from the "public" directory
app.use(express.static("public"));

let webhookDataList = [];

// Endpoint to receive webhook POST requests
app.post("/webhook", (req, res) => {
  const webhookData = req.body;
  console.log("Received webhook:", webhookData);

  // Validate the structure of the incoming data
  if (
    webhookData.data &&
    typeof webhookData.data.antenna !== "undefined" &&
    typeof webhookData.data.eventNum !== "undefined" &&
    webhookData.data.format === "epc" &&
    webhookData.data.hostName === "FX96007392D1" &&
    typeof webhookData.data.idHex !== "undefined" &&
    typeof webhookData.data.peakRssi !== "undefined" &&
    typeof webhookData.data.reads !== "undefined" &&
    webhookData.timestamp &&
    webhookData.type === "INVENTORY"
  ) {
    // Store the data
    webhookDataList.push(webhookData);
    // Respond with a success message
    res.status(200).send("Webhook received and processed");
  } else {
    // Respond with an error message if the data structure is incorrect
    res.status(400).send("Invalid data structure");
  }
});

// Endpoint to display the webhook data
app.get("/inventory", (req, res) => {
  res.render("show-data", { webhookDataList });
});
app.post("/clear-data", (req, res) => {
  const { antenna } = req.body;
  webhookDataList = webhookDataList.filter(
    (data) => data.data.antenna !== antenna
  );
  res.redirect("/show-data");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
