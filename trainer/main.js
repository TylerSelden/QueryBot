const NLPManager = require("node-nlp").NlpManager;
const fs = require("fs");
const path = require("path");

function processData(path, defaults) {
  var manager = new NLPManager({ languages: ["en"], forceNER: true, nlu: { log: false } });

  var rawData = fs.readFileSync(path, "utf8").toString().split('\n');
  var intent = 0;
  for (var i in rawData) {
    var line = rawData[i];
    var question = line.split('\t')[0];
    var answer = line.split('\t')[1];

    if (line == "") {
      intent++;
      continue;
    }
    manager.addDocument("en", question, intent.toString());
    manager.addAnswer("en", intent.toString(), answer);
  }
  for (var i in defaults) manager.addAnswer("en", "None", defaults[i]);
  return manager;
}

async function train(manager, savePath) {
  await manager.train();
  manager.save(savePath);
  if (fs.existsSync("model.nlp")) fs.unlinkSync("model.nlp");
}

async function trainModel(name, testQuery) {
  var model = processData(path.join(__dirname, `${config.trainer.data}/${name}.tsv`), config.trainer.defaults);
  await train(model, `${config.models}/${name}.nlp`);

  if (!testQuery) return console.log(`Model "${name}" trained.\n`);

  var answer = await model.process(testQuery);
  console.log(`Model "${name}" trained.\nQuery: ${testQuery}\nAnswer: ${answer.answer}\n`);
}

// load config file
const config = JSON.parse(fs.readFileSync("config.json"));

fs.readdirSync(path.join(__dirname, config.trainer.data)).forEach(async (file) => {
  if (!file.endsWith(".tsv")) return;
  var name = path.parse(file).name;
  await trainModel(name);
});