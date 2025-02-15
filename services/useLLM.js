export async function callLLM(prompt) {
    let apiKey = "PUiNsbq8LK7uFAco8F9O5Zt0kJ2ylAae";
    const response = await fetch(`https://api.mistral.ai/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            "role": "user",
            "content": prompt
          }
        ],
        response_format: {
          type: "text"
        },
        max_tokens: 100
        })
      });
    
    if (!response.ok) {
      console.error("Error:", response.status, response.statusText);
      return null;
    }
  
    const data = await response.json();
    return data.choices[0].message.content.trim();
}