let counter = 0;
let messageCallback = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`[edgeLoverBridge][onMessage]${JSON.stringify(request)}`);
    let requestId = request.id;
    let id = ++counter;
    messageCallback[id] = [requestId, sendResponse];
    window.postMessage({source: 'edge-lover-bridge', ...request, id});
    return true;
});

window.addEventListener('message', async event=>{
    if (event.source !== window || event.data.destination !== 'edge-lover-bridge') {
        return;
    }
    console.log(`[edgeLoverBridge][onEvent]${JSON.stringify(event.data)}`);

    delete event.data.destination;
    let data = event.data;

    if (data.type === 'request') {
        chrome.runtime.sendMessage(event.data, response => {
            console.log(`[edgeLoverBridge][onResponse]${JSON.stringify(response)}`);
            window.postMessage({source: 'edge-lover-bridge', ...response});
        })
    }

    if (data.type === 'response') {
        let requestId = messageCallback[data.id][0]
        messageCallback[data.id][1]({...data, id: requestId});
        delete messageCallback[data.id];
    }
});


// hook
const script = document.createElement('script');
script.src = chrome.runtime.getURL('pageHook.js');
script.onload = function() { this.remove(); };
document.documentElement.appendChild(script);
