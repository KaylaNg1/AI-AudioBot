import { OpenAI } from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import { generate_corrected_transcript_with_cloudinary_audio_file } from './utils.js'
import * as dotenv from 'dotenv';

dotenv.config();

// Create and configure your Cloudinary instance.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// initialize express
const app = express();
// initialize port
const port = 8000; // can set to any available port
app.use(bodyParser.json());
app.use(cors());

console.log(process.env.OPENAI_ORGANIZATION);
// setting up open AI
const openai = new OpenAI(({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY
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
        "content": process.env.AI_PROMPT,
        
      },
      ...chats
    ],
  });

  response.json(
    {
      output: result.choices[0].message,
    }
  )

});

// want to create POST endpoint
app.post("/speechToText", async (request, response) => { // set up url for POST endpoint
  if ("audio" in request.files) { // looking for file name
    audio_file = request.files["audio"];
    if (audio_file) {
      // generate unique filename for audio file
      let folder = "open-ai-audio";
      let fileName = "userAudio.wav";
      // save audio file to the "open-ai-audio" folder in cloudinary
      let result = cloudinary.uploader(
        audio_file,
        folder = folder,
        resource_type = "raw",
        public_id = fileName,
        overwrite = true,
      )
      // get public URL of the uploaded audio file
      const audio_url = result["secure_url"];
      let transcript = generate_corrected_transcript_with_cloudinary_audio_file(result);
      let status = transcript[0];
      let res = transcript[1];
    }
  }
});

// can interact w/ server through port
app.listen(port, () => { // takes port to listen to and callback function
  console.log(`Listening to port ${port}.`);
});
