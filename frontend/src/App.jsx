import { useState } from 'react';
import mic from "./assets/mic.png";

import Modal from "./components/Modal"

// basis of the react app
function App() {
  // create states

  // will hold all messages
  const [message, setMessage] = useState("");
  // keep track of all chat messages, user or assistant
  const [chats, setChats] = useState([]);
  // ?
  const [isTyping, setIsTyping] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  // chat object
  const chat = async (e, message) => {
    // prevent page from reloading
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    // spread out the chats and add new message
    // important so chat can relate back to previous exchanges to generate
    // responses based on new user input
    let msgs = chats;
    msgs.push({
      role: "user",
      content: message
    });
    setChats(msgs);
    // clear the message -> set back to default empty string
    setMessage("");

    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json())
      // now processing
      .then((data) => {
        msgs.push(data.output); // refer to json in backend
        setChats(msgs);
        setIsTyping(false);
      })
      .catch((error) =>
        console.log(error)
      );
  }

  // AUDIO FUNCTIONS

  // Function to handle recording and saving the audio
  function getAudio() {
    // Clear the recordedChunks array for future recordings
    let recordedChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }) // returns promise of requested media
      .then((stream) => { // takes successful media stream
        // Create a MediaRecorder object and assign the stream to it
        mediaRecorder = new MediaRecorder(stream);

        // Store the MediaStream object
        mediaStream = stream;

        // Event listener for data available during recording
        mediaRecorder.ondataavailable = (event) => {
          recordedChunks.push(event.data);
        };

        // Event listener for stopping the recording
        mediaRecorder.onstop = (e) => {
          // Combine the recorded chunks into a single Blob ( or chunk of data )
          const recordedBlob = new Blob(recordedChunks, { type: "audio/wav" });

          // Show a message to indicate recording has stopped
          // alert('Recording stopped. Click "Save Audio" to save the recording.');

          // Call the function to handle saving the audio
          saveAudio(recordedBlob);
        };

        // Start recording
        mediaRecorder.start();

        // Show a message to indicate recording has started
        // alert('Recording voice... Click "Stop" to stop recording.');
      })
      .catch(function (error) {
        console.error("Error accessing user media:", error);
      });
  }

  // Function to handle saving the audio to the server using Ajax
  function saveAudio(audioBlob) {
    const formData = new FormData(); //creates set of key/val pairs
    formData.append("audio", audioBlob, "recorded_audio.wav"); // name, val, filename

    $.ajax({
      type: "POST",
      url: "/speech-to-text",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        const { status, result } = data;
        if (status == "success") {
          $("#userInput").val(result);
        } else {
          console.log(result);
          alert("Something went wrong. Please try again.");
        }
      },
      error: function (error) {
        alert("Something went wrong. Please try again.");
        console.error("Error saving audio file:", error);
      },
    });
  }

  return (
    <main>
      <h1>KaleBot</h1>
      <section>
        {
          chats && chats.length ?
            // for each chat
            chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role == "assistant" ? "KALEBOT" : chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span> {chat.content}</span>
              </p>
            )) : ""
        }
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <div className="userInput">
        <form action="" onSubmit={(e) => chat(e, message)}>
          <input type="text"
            name="message"
            value={message}
            placeholder="Type a message and hit enter"
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
        <div className="image">
          <button onClick={() => setIsOpen(true)}>
            <img id = "mic" src = {mic}></img>
          </button>
        </div>
      </div>
      {isOpen && <Modal setIsOpen={setIsOpen} />}
    </main>
  )
}

export default App;