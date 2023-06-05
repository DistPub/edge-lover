function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`[onMessage]:${JSON.stringify(request)}`);

    chrome.tabs.query({url: request.origin + '/*'}, tabs => {
        if (tabs.length) {
            let tab = tabs[getRandomInt(tabs.length)];
            chrome.tabs.sendMessage(tab.id, request, response => {
                console.log(`[onRespnose]${JSON.stringify(response)}`);
                sendResponse(response);
            });
        } else {
            sendResponse({type: 'response', id: request.id, payload: {error: 'Edge not found for origin: ' + request.origin}})
        }
    });
    return true;
});