# QueryBot

QueryBot is a context-based question-answering AI, available via a REST API.

## How does it work?

The premise of QueryBot is that it will accept `.txt` files within the context directory, and be able to answer questions based on that data.

## Quick Start

To get the server up and running, simply clone the repository, `cd` into it, and start it up:

```bash
git clone https://github.com/TylerSelden/QueryBot
cd QueryBot
npm i
npm start
```

The default configuration should work fine, but it's recommended that you change it to suit your needs.

## Configuration

Configuration for QueryBot is always found in the `./config.json` file, in JSON format. Here's a guide on each parameter:

`useHTTPS`: A boolean value that determines whether the API is served with SSL or not.
`HTTPS.cert`: The path to the SSL certificate file. Only needed when `useHTTPS` is true.
`HTTPS.key`: The path to the SSL key file. Only needed when `useHTTPS` is true.
`port`: The port that the API will be served on. Recommended as `8080` for HTTP and `8443` for HTTPS.
`reloadInterval`: The time (in seconds) that the server will reload configuration, context files, etc.
`keys`: The path to the `keys.json` file, containing an array of valid API keys.
`context`: The directory where context files are placed.
`ai.task`: Keep as `question-answering`, otherwise the script will break.
`ai.model`: The model that is used. Recommended to not change this parameter.

**WARNING:** Make sure all confidential files are inside of the `secrets` folder!

## Context Files

Since the AI runs off of large blocks of text, these are put into Context Files. These files are all found within the `config.context` directory (`./context` by default). Within this directory, there must be sub-directories for each topic. For example, if you wanted to make a Football subject, you'd create a `./context/football` directory. Within that directory, you may put the following types of files, to be read and used by the AI:

- `.txt`

(More coming soon)

## API

To access the API, create a POST request to the server hosting QueryBot, on the correct port, on the path `/api/answer_question`. The request should be in JSON formatting, and adhere to the following structure:

```json
{
  "question": "<Your question>",
  "context": "<context topic>",
  "key": "<API key>"
}
```

The API will return `HTTP_401` if the key is invalid, and `HTTP_400` if the data is invalid. Otherwise, the response will have the following format:

```json
{
	"answer": "<Answer to your question>",
	"score": <AI's confidence score>
}
```

## Notes

Much more will be added soon, this is an extremely rough-around-the-edges project. Since the bare bones have been laid down, I'm working on improving it as quickly as possible. It should still work generally the same from the user's perspective, it'll be mostly the internals of the program changing. Currently, I'm working on accuracy and QoL improvements.
