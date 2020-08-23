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
    "revision": "db1dc3a094bedcc38deb45302a26c5fa"
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
    "url": "assets/css/0.styles.8f5179dc.css",
    "revision": "28b0b8202b831f2f27f934f51d5b841a"
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
    "url": "assets/js/10.891b3b6a.js",
    "revision": "921086fa626563a41b7e5c5fb3d545b4"
  },
  {
    "url": "assets/js/11.f0b6a196.js",
    "revision": "8f2cc0be75f9bb88a0d6504a4cbf4965"
  },
  {
    "url": "assets/js/12.907081da.js",
    "revision": "6b09fe8b9bbe205fa8657ef984c95c22"
  },
  {
    "url": "assets/js/13.0f0e6746.js",
    "revision": "d862a97f23eba7b8229e676853d4f301"
  },
  {
    "url": "assets/js/14.62e72b2f.js",
    "revision": "842ee156e731aeb99d2cefba054bbe5a"
  },
  {
    "url": "assets/js/15.99194b3d.js",
    "revision": "13ce70de6a22cd4e67e836fbd5a05656"
  },
  {
    "url": "assets/js/16.1f29dbc0.js",
    "revision": "f71b4c7fdde85a2cbdad9f62cc6514cd"
  },
  {
    "url": "assets/js/17.8c312797.js",
    "revision": "049cc0738bbb294fcb2766f985f8146f"
  },
  {
    "url": "assets/js/18.827ac3c7.js",
    "revision": "acaa3bc333d7152c39929b69617c40fc"
  },
  {
    "url": "assets/js/19.ab2c25cb.js",
    "revision": "52920b89f522f82efd0c6d4114a16441"
  },
  {
    "url": "assets/js/20.e239cfd9.js",
    "revision": "091f79a2d7804ab4e950670513860c30"
  },
  {
    "url": "assets/js/21.ee30eeb7.js",
    "revision": "db31aacfc6f69c68a4b7bbe5c0c59387"
  },
  {
    "url": "assets/js/22.3423b64e.js",
    "revision": "4543495701202a8867e5ba8b426c3991"
  },
  {
    "url": "assets/js/23.e5339312.js",
    "revision": "cca82e43e6210c26032e0354d033b535"
  },
  {
    "url": "assets/js/24.63da4e8f.js",
    "revision": "1e26d371fb49fad5244de81380414dbc"
  },
  {
    "url": "assets/js/25.dfa044d6.js",
    "revision": "0039d17bd129857974bb64948ce920b7"
  },
  {
    "url": "assets/js/26.4e618ebb.js",
    "revision": "c9f40b4e670edb51f2797cc444119cba"
  },
  {
    "url": "assets/js/27.2e7fb935.js",
    "revision": "34e20d2751bcd2bb1082f6e8a7d2e669"
  },
  {
    "url": "assets/js/28.bebe343f.js",
    "revision": "93c15a218e6fd864e8b35284e6513a27"
  },
  {
    "url": "assets/js/29.e09fb273.js",
    "revision": "9490817b0555c204d02aa33ec39c4936"
  },
  {
    "url": "assets/js/3.383822be.js",
    "revision": "7a0e0c26df7aca13b5e5d950fa1c2aec"
  },
  {
    "url": "assets/js/4.996e731d.js",
    "revision": "fbcf73db1f70ba9ba1e2e1d8b8e925c2"
  },
  {
    "url": "assets/js/5.4533e1f4.js",
    "revision": "77dd3f71d61e19a369da9b6e85a7af77"
  },
  {
    "url": "assets/js/6.80f6bfe0.js",
    "revision": "d9c1bf645e47b8820a17a9d775a25fc0"
  },
  {
    "url": "assets/js/7.34946731.js",
    "revision": "ebd86935b9aee2acb03b0f30ad77802f"
  },
  {
    "url": "assets/js/8.894a275a.js",
    "revision": "3b012109452e511551e1da11495bec63"
  },
  {
    "url": "assets/js/9.2cc991f9.js",
    "revision": "018e3908caa39dbc38c6461dc9dc84ab"
  },
  {
    "url": "assets/js/app.72d48c19.js",
    "revision": "fea6faa52048171d96ca6c567ea3a39a"
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
    "revision": "90f9475bca9fe5eff0106c8bc7d6015c"
  },
  {
    "url": "guide/cli.html",
    "revision": "f56955a2a33043f7961eb274bc592195"
  },
  {
    "url": "guide/cluster.html",
    "revision": "215693290d3d6770edf8afb5b20fbbe5"
  },
  {
    "url": "guide/configuration.html",
    "revision": "b83c55d665da86bd0d79075a305e3b48"
  },
  {
    "url": "guide/entities.html",
    "revision": "3babe3acfa8030afbf85823cd245ba0d"
  },
  {
    "url": "guide/index.html",
    "revision": "b2d4fd139a5b9d320029233187152f67"
  },
  {
    "url": "guide/installation.html",
    "revision": "a7508808756047286d37bf9fc17e58a2"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "7d3592382472f7e1cef11d7399bec918"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "8e1b88f39b468babc843c921800b02d3"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "79621406b4a22291d4e3f81ecb69c5fe"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "3399b930bd84ad5b4aeb9991aab4c765"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "1d0c677407c4cfee54328e5c35d7fc28"
  },
  {
    "url": "index.html",
    "revision": "e7409ec8562bc9f7fa5d7a8f4844eaea"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "572055f1634b49b2d5ac713f25fb3c56"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "44432c5541d05d2e4c31764c86d6b3f6"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "9488e553d5da5ea671a3afdebfe145cf"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "5f58825301cf236d0884d50faf93abda"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "0defa31f1b9e72732634286c9db9b462"
  },
  {
    "url": "integrations/index.html",
    "revision": "ec4853403308cb1dcc3dd93afa9c996c"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "6f30a375cd71bcd82aed4048e70222b5"
  },
  {
    "url": "integrations/shell.html",
    "revision": "95e19842d9c9232d018c0c7e08ae369e"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "5ce9cd9709c88fa92b8de3e7f52bbd92"
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
