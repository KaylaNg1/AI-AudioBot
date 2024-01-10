import { useState } from 'react';

// basis of the react app
function App() {
  // create states

  // will hold all messages
  const [message, setMessage] = useState("");
  // keep track of all chat messages, user or assistant
  const [chats, setChats] = useState([]);
  // ?
  const [isTyping, setIsTyping] = useState(false);

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
                  <b>{ chat.role == "assistant" ? "KALEBOT" : chat.role.toUpperCase()}</b>
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

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input type="text"
          name="message"
          value={message}
          placeholder="Type a message and hit enter"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  )
}

// ?
export default App;