import { callLLM } from './services/useLLM.js'; 
import * as TTS from './content.js'; 

prompt = "";

document.getElementById("usellm").onclick = () => {
  prompt = document.getElementById("userInput").value;
  (async () => {
    const response = await callLLM(`You are an advanced AI assistant chatbot designed to provide helpful, clear, and concise answers to the user. Your primary goal is to assist the user by offering short, accurate, well-explained, and relevant information. Don't leave sentences incomplete. Answer in around 50 words. Now, provide response to this: ${prompt}`);
    console.log(response);

    document.getElementById("display").textContent=response;
    TTS.speak(response);
  })();
}

// !!!!!!!!!!!!!!!!!!!!!!           TEXT-TO-SPEECH             !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// document.getElementById("speak").onclick = () => {
//   console.log("Accepted VO");
//   let text = document.getElementById("userWord").value;;
//   TTS.speak(text);
// }

document.getElementById("pause-resume").addEventListener("click", TTS.togglePauseResume);

document.getElementById("cancelBtn").addEventListener("click", TTS.cancelSpeech);

// !!!!!!!!!!!!         VOICE INPUT            !!!!!!!!!!!!!!!!

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;


document.getElementById("start-voice").onclick = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }) // Request microphone permission
    .then(() => {
      recognition.start(); // Start only after permission granted
    })
    .catch(err => console.error("Microphone access denied:", err));
}

recognition.onstart = () => {
  console.log("Listening...");
  document.getElementById("output").innerText = "Listening...";
}
recognition.onresult = (event) => {
  const command = event.results[0][0].transcript;
  document.getElementById("output").innerText = `Command received: ${command}`;
  console.log(`Input received: ${command}`);
  chrome.runtime.sendMessage({ action: "executeCommand", command: command });  
};

recognition.onspeechend = () => {
    recognition.stop();
    console.log('Stopping Voice Input');
  };

recognition.onerror = (event) => {
    console.log(`Error occurred in recognition: ${event.error}`);
    document.getElementById("output").innerText = `Error: ${command} (try again)`;
  };

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "LLMresponse") {
      document.getElementById("output").innerText = request.text;
    }
  });