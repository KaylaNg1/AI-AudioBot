import { OpenAI } from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// initialize express
const app = express();
// initialize port
const port = 8000; // can set to any available port
app.use(bodyParser.json());
app.use(cors());

// setting up open AI
const openai = new OpenAI(({
}));

// setting up server

// want to create POST endpoint
app.post("/", async (request, response) => { // set up url for POST endpoint
  const { chats } = request.body;

  // interacting w/ openAI 
  const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { 
      "role": "system", 
      "content": "You are KaleBot. You can write emails and letters" 
      },
      ... chats
    ],
  });

  response.json(
    {
      output: result.choices[0].message,
    }
  )

});

// can interact w/ server through port
app.listen(port, () => { // takes port to listen to and callback function
  console.log(`Listening to port ${port}.`);
});
