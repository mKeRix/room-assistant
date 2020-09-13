/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "0bf108561abf9b0864ccdaae99599b63"
  },
  {
    "url": "android-chrome-192x192.png",
    "revision": "01bafd5cc06880d98f79eb014521b310"
  },
  {
    "url": "android-chrome-384x384.png",
    "revision": "f2d43f64b33b3aeeca99f27c463d2aad"
  },
  {
    "url": "apple-touch-icon.png",
    "revision": "f88235df4c68f647bcf9eff7df846cc0"
  },
  {
    "url": "assets/css/0.styles.8932e1f6.css",
    "revision": "5e0753d0a4a670cf52ebc41a26e5d1ab"
  },
  {
    "url": "assets/img/compilation-msgs.0260ae46.png",
    "revision": "0260ae461e640d240d857c5c03220685"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.106a0f60.js",
    "revision": "921086fa626563a41b7e5c5fb3d545b4"
  },
  {
    "url": "assets/js/11.b478e7e9.js",
    "revision": "8f2cc0be75f9bb88a0d6504a4cbf4965"
  },
  {
    "url": "assets/js/12.f5b83537.js",
    "revision": "6b09fe8b9bbe205fa8657ef984c95c22"
  },
  {
    "url": "assets/js/13.5f7ac0ac.js",
    "revision": "c7514b7091f0df34779533584bdccdfc"
  },
  {
    "url": "assets/js/14.49fb60f8.js",
    "revision": "7c79b36e5a0cca262d2be6b46fc86f07"
  },
  {
    "url": "assets/js/15.7ffd1a9c.js",
    "revision": "41193062a52dbb291ef1a9cf5254ccf0"
  },
  {
    "url": "assets/js/16.68c18c03.js",
    "revision": "f71b4c7fdde85a2cbdad9f62cc6514cd"
  },
  {
    "url": "assets/js/17.38589f86.js",
    "revision": "049cc0738bbb294fcb2766f985f8146f"
  },
  {
    "url": "assets/js/18.b57ff976.js",
    "revision": "acaa3bc333d7152c39929b69617c40fc"
  },
  {
    "url": "assets/js/19.85c51f35.js",
    "revision": "52920b89f522f82efd0c6d4114a16441"
  },
  {
    "url": "assets/js/20.e5c3c39e.js",
    "revision": "091f79a2d7804ab4e950670513860c30"
  },
  {
    "url": "assets/js/21.c62a78ea.js",
    "revision": "045de0f815ec575e89bba9e9ddde6be1"
  },
  {
    "url": "assets/js/22.557467b7.js",
    "revision": "1e7aee871ec10550958d498fa45ad93c"
  },
  {
    "url": "assets/js/23.127612cf.js",
    "revision": "cca82e43e6210c26032e0354d033b535"
  },
  {
    "url": "assets/js/24.afa5f5ad.js",
    "revision": "1e26d371fb49fad5244de81380414dbc"
  },
  {
    "url": "assets/js/25.8935fbb1.js",
    "revision": "0039d17bd129857974bb64948ce920b7"
  },
  {
    "url": "assets/js/26.9fcbcb09.js",
    "revision": "c9f40b4e670edb51f2797cc444119cba"
  },
  {
    "url": "assets/js/27.c3591ebf.js",
    "revision": "34e20d2751bcd2bb1082f6e8a7d2e669"
  },
  {
    "url": "assets/js/28.f0258160.js",
    "revision": "93c15a218e6fd864e8b35284e6513a27"
  },
  {
    "url": "assets/js/29.e09fb273.js",
    "revision": "9490817b0555c204d02aa33ec39c4936"
  },
  {
    "url": "assets/js/3.24876ab1.js",
    "revision": "c833d16b2ded13b740ab225fb462228a"
  },
  {
    "url": "assets/js/4.0665c7e3.js",
    "revision": "fbcf73db1f70ba9ba1e2e1d8b8e925c2"
  },
  {
    "url": "assets/js/5.4533e1f4.js",
    "revision": "77dd3f71d61e19a369da9b6e85a7af77"
  },
  {
    "url": "assets/js/6.31118ad5.js",
    "revision": "d9c1bf645e47b8820a17a9d775a25fc0"
  },
  {
    "url": "assets/js/7.c2f8b730.js",
    "revision": "ebd86935b9aee2acb03b0f30ad77802f"
  },
  {
    "url": "assets/js/8.06da213a.js",
    "revision": "3b012109452e511551e1da11495bec63"
  },
  {
    "url": "assets/js/9.eff87691.js",
    "revision": "018e3908caa39dbc38c6461dc9dc84ab"
  },
  {
    "url": "assets/js/app.4ca852d1.js",
    "revision": "4ff9ca9095e65ab6d545847e83c5944d"
  },
  {
    "url": "assets/js/vendors~docsearch.72eb914c.js",
    "revision": "5074e2a20bd451c2f8647253871a3b47"
  },
  {
    "url": "favicon-16x16.png",
    "revision": "c6b93302fc3f2ea8f101011a70d63a08"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "d00874ce1e43be2ac335d1e80c0c8ead"
  },
  {
    "url": "guide/api.html",
    "revision": "bac26fad2db60f04965587b1547f63b2"
  },
  {
    "url": "guide/cli.html",
    "revision": "6f373e28e97a748d6b01d71f21335bf2"
  },
  {
    "url": "guide/cluster.html",
    "revision": "c12e16d774f771b52ce0795abd6cb863"
  },
  {
    "url": "guide/configuration.html",
    "revision": "b3ff8b149285e8254ca1fd7411895d15"
  },
  {
    "url": "guide/entities.html",
    "revision": "765c9592a2b0312486ca933f0c59452b"
  },
  {
    "url": "guide/index.html",
    "revision": "03e1f2c7a6bb0b05b5bff13a3f00865d"
  },
  {
    "url": "guide/installation.html",
    "revision": "85b49fe8ba4a9b93d11d9aaf7e90fc9e"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "a2e0960e167d46ac325de4a04988404b"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "921af7c4f2d70722a792605ec2cd0cf3"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "cf6c4c48e1e1f136dbdc34b6c22a1872"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "dba2ae91ab6f918ed4f50ec9cae89763"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "36450276badeee941b923c99eb284e2d"
  },
  {
    "url": "index.html",
    "revision": "2d537b0949015c2bce1fe86d05559edc"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "f3dc8a263b6f4f453bdc768a8701041d"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "06a1ba7992fabda740182fbe47582bce"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "17a1336d78479b134208bea38d8866a3"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "dc7694bab0ee58de779313e0768798a6"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "0cf5614aafb3cf5cfeaa8a952ae91d2e"
  },
  {
    "url": "integrations/index.html",
    "revision": "4edb893635e1cccdaaf4e4db74b27349"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "67f9b4adaf2b2da4c9692ea5a115593a"
  },
  {
    "url": "integrations/shell.html",
    "revision": "1f24d73c9664983fa893546d8214f94a"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "4e531df02b24543b6fd6fb03e9b6fa9a"
  },
  {
    "url": "mstile-150x150.png",
    "revision": "5461702e6d17101516497b481857edd8"
  },
  {
    "url": "room-assistant.png",
    "revision": "e79e479593059c21d0971d8d802c5a9c"
  },
  {
    "url": "safari-pinned-tab.svg",
    "revision": "37c5052d727a9267b550b55e1faec638"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
