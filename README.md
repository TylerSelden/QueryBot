# QueryBot

QueryBot is a question-answering AI, capable of using multiple models at once, available via a REST API.

## How does it work?

The premise of QueryBot is that it will accept `.nlp` model files inside the `./models/` directory, and serve them via an API where the user can select the model they want to use.

## Quick Start

To get the server up and running, simply clone the repository, `cd` into it, and start it up:

```bash
git  clone  https://github.com/TylerSelden/QueryBot
cd  QueryBot
npm  i
npm  start
```

The default configuration should work fine, but it's recommended that you change it to suit your needs.

## Configuration

Configuration for QueryBot is always found in the `./config.json/` file, in JSON format. Here's a guide on each parameter:

`useHTTPS`: A boolean value that determines whether the API is served with SSL or not.

`HTTPS.cert`: The path to the SSL certificate file. Only needed when `useHTTPS` is true.

`HTTPS.key`: The path to the SSL key file. Only needed when `useHTTPS` is true.

`port`: The port that the API will be served on. Recommended as `8080` for HTTP and `8443` for HTTPS.

`reloadInterval`: The time (in seconds) that the server will reload configuration, context files, etc.

`keys`: The path to the `keys.json` file, containing an array of valid API keys.

`models`: The directory where all model files are stored.

`trainer.data`: The directory where all training data for the models are stored.

`trainer.defaults`: The default responses of the models, if it doesn't know what to say.

~~`ai.task`: Keep as `question-answering`, otherwise the script will break.~~

~~`ai.model`: The model that is used. Recommended to not change this parameter.~~

**WARNING:** Make sure all confidential files are inside of the `secrets` folder!

## Model files

Each model is loaded through a model file, with the `.nlp` extension. Usually, QueryBot loads all of these files from the `./models/` directory, and serves them all at once. These model files are created and loaded through the `node-nlp` package.

## Training

QueryBot has a utility to help train models to be used. Here is the general procedure for training a model:

1.  **Create a set of training data.** This needs to be in `TSV` (tab-separated value) format. Place the `.tsv` file in the `./trainer/data/` directory, with the name of the file being the name of the model (e.g. the model "test" would have the file `test.tsv`).

2.  **Start the trainer.** From the root of the project, run `npm run train`, and it will train a model for each `.tsv` file in the `./trainer/data/` directory. Default configuration puts these models straight into the `./models/` directory.

3.  **Run QueryBot.** Lastly, you need to actually start QueryBot, but the models are now trained and ready.

---

### Training Data Format

The way you format your training data is extremely important to get an accurate model. For starters, the way a `.tsv` file is structured is as follows:

```
Value 1A [tab] Value 1B [tab] Value 1C
Value 2A [tab] Value 2B [tab] Value 2C
```

It should be clear from this that each value is separated by a tab (`\t`) character. This type of file is structured like a table, with newlines separating rows.

For each response you want your model to give, you should have several question-answer pairs, like this:

```tsv
Hello.	Hi there!
Hi!	What's up?
Howdy.	Hi, how are you?

Bye!	See ya!
I have to go.	Have a nice day!
Farewell.	See you later!
```

As you can see from this example, there are 3 examples for each question-answer type, or "intent" (in this case, hellos and goodbyes). **It's highly recommended to have 5-10 examples for each question-answer type!** It's also super important to use lots of different words in each example, as the model classifies which response to use by the words it sees. If it sees a lot of words it doesn't know, it won't know what to do. In between each intent, there should be one line of empty space. This tells the model that a new intent is being started. This is required, otherwise the model will not work.

Recap:

- Use TSV formatting
- Have around 5-10 question-answer pairs for each intent
- Use a wide vocabulary for each example
- In between each block of examples, leave a line of empty space to separate different intents

## API

To access the API, create a POST request to the server hosting QueryBot, on the correct port. The request should be in JSON formatting, and adhere to the following structure:

```json
{
  "question": "<Your question>",
  "model": "<AI model>",
  "key": "<API key>"
}
```

The API will return `HTTP_401` if the key is invalid, and `HTTP_400` if the data is invalid. Otherwise, the response will be either raw text or JSON data.

- `/api/get_answer`: Gives the raw text answer to the question.
- `/api/get_response`: Gives a JSON object with the answer, confidence, and more.
- `/api/send_feedback`: Sends feedback to the developers. Use this to send questions that the model did not know how to respond to, to improve the model.

**Note:** When sending feedback, replace the `question` parameter with one called `feedback`.

## Examples

Examples for all of this can be found in the `./examples/` directory.

## Notes

Much more will be added soon, this is an extremely rough-around-the-edges project. Since the bare bones have been laid down, I'm working on improving it as quickly as possible. It should still work generally the same from the user's perspective, it'll be mostly the internals of the program changing. Currently, I'm working on accuracy and QoL improvements.