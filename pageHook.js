;(function hook(window) {
  let counter = 0;
  let messageCallback = {};

  window.addEventListener('message', async event=>{
    if (event.source !== window || event.data.source !== 'edge-lover-bridge') {
      return;
    }
    console.log(`[edge][onEvent]${JSON.stringify(event.data)}`);

    delete event.data.source;
    let data = event.data;

    if (data.type === 'request') {
        let message = {type: 'response', destination: 'edge-lover-bridge', id: data.id};
        try {
            let response = await fetch(data.payload.api, data.payload.options);
            let arrayBuffer = await response.arrayBuffer();
            let body = btoa([].reduce.call(new Uint8Array(arrayBuffer), (p, c) => p + String.fromCharCode(c), ''));
            let headers = {};
            response.headers.forEach((value, key)=>headers[key]=value);
            let options = {status: response.status, statusText: response.statusText, headers};
            message.payload = {body, options};
        } catch (error) {
            message.payload = {error: error.message || error.stack || error.toString()};
        }
        window.postMessage(message);
    }

    if (data.type === 'response') {
        if (data.payload.error) {
            messageCallback[data.id][1](data.payload.error);
        } else {
            let body = atob(data.payload.body);
            let bytes = new Uint8Array(body.length);
            for (let idx = 0 ; idx < body.length; idx ++) {
                bytes[idx] = body.charCodeAt(idx);
            }
            let response = new Response(bytes.buffer, data.payload.options);
            messageCallback[data.id][0](response);
        }
        delete messageCallback[data.id];
    }
  });


  window.edgeFetch = (api, options={}) => {
    let id = ++ counter;
    let origin;
    if (options.edgeOrigin) {
        origin = options.edgeOrigin;
        delete options.edgeOrigin;
    } else {
        let url = new URL(api);
        origin = url.origin;
    }
    let message = {id, destination: 'edge-lover-bridge', origin, type: 'request', payload: {api, options}};
    console.log(`[edge][fetch]${JSON.stringify(message)}`);
    window.postMessage(message);
    return new Promise((resolve, reject) => messageCallback[id] = [resolve, reject]);
  };
})(window);
