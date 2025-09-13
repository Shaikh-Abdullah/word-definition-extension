const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "getDefinition"){
        const word = request.word;
        console.log(`Background Script: Received request for word: ${word}`);

        const apiUrl = `${API_URL}${word.toLowerCase()}`;

        fetch(apiUrl)
        .then(response => {
            if(!response.ok) {
                console.error(`API response status: ${response.status} - ${response.statusText}`);
                throw new Error(`API response was not ok: ${response.statusText || 'No status text available'}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Background Script: API response:", data);
            let definition = "Definition not found";

            if (data && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
                const allDefinitions = [];
                data[0].meanings.forEach(meaning => {
                    meaning.definitions.forEach(def => {
                        allDefinitions.push(def.definition);
                    });
                });
                
                if (allDefinitions.length > 0) {
                    // Format definitions as a numbered list
                    definition = allDefinitions.map((def, index) => `${index + 1}. ${def}`).join('\n\n');
                }
            }
            sendResponse({definition});
        })
        .catch(error => {
            console.error('Background Script: Error fetching definition:', error);
            sendResponse({ definition: 'Failed to fetch definition.' });
        });
        return true;
    }
})
