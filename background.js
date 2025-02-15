import { callLLM } from './services/useLLM.js'; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "executeCommand") {
      let command = request.command.toLowerCase();

      if (command.includes("open")) {
          let site = command.replace("open ", "").replace(/\s+/g, "");

          (async () => {
            const response = await callLLM(`Act as an assistant to provide accurate URLs for ${site}. Find the official and most latest URL you can. Ensure the URL is correct and functional. Just send the url (no other text).`);
            console.log('Site:', response);
            chrome.tabs.create({ url: response });
            // chrome.tabs.create({ url: `https://www.${site}.com` });
            })();
      }
      else if (command.includes("search for")) {
          let query = command.replace("search for ", "");
          chrome.tabs.create({ url: `https://www.google.com/search?q=${query}` });
      }
      else if (command.includes("close tab")) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.remove(tabs[0].id);
          });
      }
      else {
        (async () => {
          console.log("Calling LLM with:", command);
          const response = await callLLM(`You are an advanced AI assistant designed to provide helpful, clear, and concise answers to the user's questions. Your primary goal is to assist the user by offering short, accurate, well-explained, and relevant information. Don't leave sentences incomplete. Answer in around 50 words. Now, provide response to this question:${command}`);
          console.log("REPLY:", response);
          chrome.runtime.sendMessage({ action: "speak", text: response });
          chrome.runtime.sendMessage({ action: "LLMresponse", text: response });
        })();
      }
  }
});