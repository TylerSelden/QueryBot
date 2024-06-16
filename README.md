
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

`context`: The directory where context files are placed.

~~`ai.task`: Keep as `question-answering`, otherwise the script will break.~~

~~`ai.model`: The model that is used. Recommended to not change this parameter.~~

  

**WARNING:** Make sure all confidential files are inside of the `secrets` folder!

  

## Model files

Each model is loaded through a model file, with the `.nlp` extension. Usually, QueryBot loads all of these files from the `./models/` directory, and serves them all at once. These model files are created and loaded through the `node-nlp` package, and a utility to create these files is coming soon.


## API

  

To access the API, create a POST request to the server hosting QueryBot, on the correct port, on the path `/api/answer_question`. The request should be in JSON formatting, and adhere to the following structure:

  

```json
{

"question": "<Your question>",

"model": "<AI model>",

"key": "<API key>"

}
```

The API will return `HTTP_401` if the key is invalid, and `HTTP_400` if the data is invalid. Otherwise, the response will have a JSON format. This JSON object contains a lot of data, so rather than documenting it all here, documentation for it can be found in the `node-nlp` docs. Most of the data won't be needed, so it's recommended that you explore the responses from the API a bit and see what data you want.

## Examples

Examples for all of this can be found in the `./examples/` directory.

## Notes

  

Much more will be added soon, this is an extremely rough-around-the-edges project. Since the bare bones have been laid down, I'm working on improving it as quickly as possible. It should still work generally the same from the user's perspective, it'll be mostly the internals of the program changing. Currently, I'm working on accuracy and QoL improvements.
