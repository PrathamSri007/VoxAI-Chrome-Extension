  //functions for voice output via TTS

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "speak") {
      speak(request.text);
      sendResponse({ status: "Speech started in content script" });
    }
  });

  export function speak(text){
    console.log("Begin utternace");
    const utterance = new SpeechSynthesisUtterance(text);
    // speechSynthesis.onvoiceschanged = () => {
    //   const voices = speechSynthesis.getVoices();
    //   const voiceName = "Google UK English Female";
      
    //   const selectedVoice = voices.find(voice => voice.name === voiceName);
  
    //   if (selectedVoice) {
    //     utterance.voice = selectedVoice; 
    //   }
  
      utterance.lang = 'en-US';
      utterance.pitch = 1.0;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
      utterance.onend= () => console.log("done");
    // };
  }
  
  let isPaused = false;
  export function togglePauseResume() {
    if (speechSynthesis.speaking) {
      if (isPaused) {
        speechSynthesis.resume();
        document.getElementById("pause-resume").innerText = "Pause";
        isPaused = false;
        console.log("Speech resumed.");
      } else {
        speechSynthesis.pause();
        document.getElementById("pause-resume").innerText = "Resume";
        isPaused = true;
        console.log("Speech paused.");
      }
    }
  }
  
  export function cancelSpeech() {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      document.getElementById("pause-resume").innerText = "Pause"; // Reset button
      isPaused = false;
      console.log("Speech cancelled.");
    }
  }
  