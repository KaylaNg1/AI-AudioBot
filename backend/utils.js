import { OpenAI } from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Buffer } = require('buffer/').Buffer;

// Create and configure your Cloudinary instance.
// Create and configure your Cloudinary instance.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


export function generate_corrected_transcript_with_cloudinary_audio_file(audio_url) {
  try {
    // Fetch the audio file as bytes using requests
    response = requests.get(audio_url);
    audio_data = response.content;
    // Create a io.BufferedReader object from the bytes data and set the name attribute
    audio_buffer = Buffer.alloc(audio_data);
    audio_buffer.name = "user_voice_input.wav";  // Replace with the desired filename
    // Pass the temporary file to the translate method
    transcript = openai.Audio.translate("whisper-1", audio_buffer);
    result = transcript.text;
    console.log(result)
    return "success", result;
  } catch (e) {
    return "fail", str(e)
  }
}