// importing stuff
const NLPManager = require("node-nlp").NlpManager;
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");

// defining other variables
var config = {};
var keys = {};
var models = {};

loadConfig();

// setting up express
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use((err, req, res, next) => {
  if (err.status === 400) return res.sendStatus(err.status);
  next(err);
});


app.post('/api/get_answer', async (req, res) => {
  var data = req.body;

  if (!keys.includes(data.key)) return res.sendStatus(401);
  if (data.question == undefined || typeof(data.question) !== "string" || data.question.length < 1) return res.sendStatus(400);
  if (data.model == undefined || typeof(data.model) !== "string" || data.model.length < 1 || models[data.model] == undefined) return res.sendStatus(400);


  var out = await models[data.model].process(data.question);
  res.send(out);
});


if (config.useHTTPS) {
  https.createServer({
    cert: fs.readFileSync(config.HTTPS.cert),
    key: fs.readFileSync(config.HTTPS.key)
  }, app).listen(config.port);
} else {
  http.createServer(app).listen(config.port);
}


console.log(`\nServer successfully started on port ${config.port}!

================================================================================================================
||    Note: After re-writing any files, you need to restart the server (this will likely change over time).   ||
================================================================================================================`);



function loadModels() {
  fs.readdirSync(config.models).forEach(file => {
    if (!file.endsWith(".nlp")) return;
    var name = path.parse(file).name;
    models[name] = new NLPManager({ languages: ["en"], forceNER: true});
    models[name].load(path.join(config.models, file));
  });
}

async function loadConfig() {
  console.log("Loading config from './config.json'...");
  config = JSON.parse(fs.readFileSync("config.json", "utf8"));

  console.log(`Config loaded, loading API keys from '${config.keys}'...`);
  keys = JSON.parse(fs.readFileSync(config.keys, "utf8"));



  console.log(`API keys loaded! Loading models...`);
  loadModels();

  console.log(`Models loaded:
  ${Object.keys(models).join(", ")}\n`);
  console.log(`Config reloading in ${config.reloadInterval} seconds...\n`);

  setTimeout(async () => {
    console.clear();
    console.log("\nRelodaing config...\n");
    await loadConfig();
  }, config.reloadInterval * 1000);
}