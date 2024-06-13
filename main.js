import { pipeline } from "@xenova/transformers";
import * as fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import https from "https";


var config = {};
var keys = {};
var contextFiles = {};
var model;

console.clear();
await loadConfig();


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
  if (data.context == undefined || typeof(data.context) !== "string" || data.context.length < 1 || contextFiles[data.context] == undefined) return res.sendStatus(400);


  var out = await model(data.question, contextFiles[data.context]);
  res.send({ answer: out.answer });
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

async function loadConfig() {
  console.log("Loading config from './config.json'...");
  config = JSON.parse(fs.readFileSync("config.json", "utf8"));

  console.log(`Config loaded, loading API keys from '${config.keys}'...`);
  keys = JSON.parse(fs.readFileSync(config.keys, "utf8"));



  console.log(`API keys loaded, loading context files from './context'...`);
  for (var dir of fs.readdirSync("./context")) {
    if (!fs.lstatSync(path.join("./context", dir)).isDirectory()) continue;

    var data = "";
    for (var file of fs.readdirSync(path.join("./context", dir))) {
      if (file.endsWith(".txt")) {
        data += fs.readFileSync(path.join("./context", dir, file), "utf8") + "\n";
      } // add other file format parsers here
    }
    
    contextFiles[dir] = data;
  }
  console.log(`Context files loaded: ${Object.keys(contextFiles).join(", ")}.`);

  console.log(`Loading model '${config.ai.model}'...`);
  model = await pipeline(config.ai.task, config.ai.model);
  console.log(`Model loaded! Config reloading in ${config.reloadInterval} seconds...\n`);

  setTimeout(async () => {
    console.log("\nRelodaing config...\n");
    await loadConfig();
  }, config.reloadInterval * 1000);
}