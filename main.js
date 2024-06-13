import { pipeline } from "@xenova/transformers";
import * as fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import https from "https";



console.clear();
console.log("Loading config from 'config.json'...");
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

console.log(`Config loaded, loading API keys from '${config.keys}'...`);
const keys = JSON.parse(fs.readFileSync(config.keys, "utf8"));

console.log(`API keys loaded, loading context files from './context'...`);
const contextFiles = {};
for (const file of fs.readdirSync("./context")) {
  if (!file.endsWith(".txt")) continue;
  contextFiles[path.parse(file).name] = path.join("./context", file);
}
console.log(`Context files loaded: ${Object.keys(contextFiles).join(", ")}.`);


console.log(`Loading model '${config.ai.model}'...`);
const model = await pipeline(config.ai.task, config.ai.model);
console.log(`Model loaded, starting server...`);


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


  var out = await model(data.question, fs.readFileSync(contextFiles[data.context], "utf8"));
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


console.log(`\nServer successfully started on port :${config.port}!\n`);
console.log(`================================================================================================================
||    Note: After re-writing any files, you need to restart the server (this will likely change over time).   ||
================================================================================================================`);