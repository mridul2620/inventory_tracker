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
const idHexToModuleMap = {
  'e280117000000216fc223db1': { moduleName: '23J04-40061', lifeNo: '111-112' },
  'e280117000000216fc2244bf': { moduleName: '23J04-40179', lifeNo: '113-114' },
  'e280117000000216fc2244bd': { moduleName: '23J04-40245', lifeNo: '105-106' },
  'e280117000000216fc223db7': { moduleName: '2022-C05-0331', lifeNo: '11' },
  'e280117000000213d1e994b2': { moduleName: '2022-C05-0332', lifeNo: '9' },
  'e280117000000216fc2245b5': { moduleName: '2022-C05-0333', lifeNo: '4' },
  'e280117000000216fc2245b4': { moduleName: '2022-C05-0334', lifeNo: '12' }
};

app.get("/", (req, res) => {
  res.redirect("http://pdsl.com");
});

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
