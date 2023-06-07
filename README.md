![](./icon128.png)
### Edge Lover

Browser as a service, you can quick fetch crosss orgin resources by use edgeFetch(api, options)

>Edge === Your browser tab

#### Install

##### install from github

1. download latest release `.crx`
2. download windows policy file `dist_allowlist.reg`(mac: `dist_allowlist.mobileconfig`)
3. run policy file
4. restart chrome(or other moden browser)
5. open extensions manage page(chrome is `chrome://extensions`)
6. enable developer mode
7. drag `.crx` file to browser

#### Example

1. open any website and a `github.com` page
2. open developer tools on any page exclude `github.com` pages
3. run it `response = await edgeFetch('https://github.com/DistPub/edge-lover')`
4. Its just success! Say goodbye to CORS error 😀.

#### API

##### edgeFetch(api, options)

the same to `window.fetch`, differences are:

1. `options.edgeOrigin` you can manually set who will make net request, default is `new URL(api).origin`
2. error throw when not found any edge to make request
3. the `response.type="basic"`, `response.url=""`
