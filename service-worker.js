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
    "revision": "11228ae903c1172424c3be7bc7509501"
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
    "url": "assets/css/0.styles.0a63d30b.css",
    "revision": "2aec67271adaa51d507a2ea225341b0e"
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
    "url": "assets/js/10.e435e2a3.js",
    "revision": "69f9454cc600d52eb1ed9609517a19af"
  },
  {
    "url": "assets/js/11.89199661.js",
    "revision": "9d3e4a22045b6ba9b53347b27eb29159"
  },
  {
    "url": "assets/js/12.200bc99d.js",
    "revision": "a3bca053da954e10a01659abfa3d9c37"
  },
  {
    "url": "assets/js/13.acf02124.js",
    "revision": "2ff2781fa3c422de9e64a952ec3b2af5"
  },
  {
    "url": "assets/js/14.ced183ca.js",
    "revision": "fab462dae322af57e1a1c5288c61d966"
  },
  {
    "url": "assets/js/15.e7cb0604.js",
    "revision": "5062dd66d4082d93d639195b9bd2a475"
  },
  {
    "url": "assets/js/16.3f697835.js",
    "revision": "454d176d9f50575d3ee9823482b0132c"
  },
  {
    "url": "assets/js/17.3c8152b1.js",
    "revision": "62cc8287b960a7c3e557ec1f0c827db1"
  },
  {
    "url": "assets/js/18.e518486e.js",
    "revision": "79828c9ff22470b8d83a63242a2f327f"
  },
  {
    "url": "assets/js/19.1150d71d.js",
    "revision": "d4353466e1109cb72092661388df58b5"
  },
  {
    "url": "assets/js/20.5a3653d7.js",
    "revision": "01425984b2ff7a6a452f829da456b8b8"
  },
  {
    "url": "assets/js/21.aea3af64.js",
    "revision": "6ed09e703893a6c0069ead05fd9924e1"
  },
  {
    "url": "assets/js/22.9eb511c0.js",
    "revision": "018df910220251c8d44be84d0b70a325"
  },
  {
    "url": "assets/js/23.5dec7497.js",
    "revision": "30b4b7c50e9f43070c4dcb7ffcc374dc"
  },
  {
    "url": "assets/js/24.b0b83917.js",
    "revision": "374d195d0b61e3beba2279e1a7f7d041"
  },
  {
    "url": "assets/js/25.6a3e6daf.js",
    "revision": "aa036c03e76f98cad86dfa7f75a830f5"
  },
  {
    "url": "assets/js/3.50b3844a.js",
    "revision": "75ad4c7049dcee2f73c3894b0f81fe2a"
  },
  {
    "url": "assets/js/4.8413a8e7.js",
    "revision": "5771909da8d4920aad42e2cf8d9651c9"
  },
  {
    "url": "assets/js/5.13a65f50.js",
    "revision": "b80016207bb2edb49c77b53e4a5a57a5"
  },
  {
    "url": "assets/js/6.4cf316a2.js",
    "revision": "e806fb7851f77144b52f139a25332df9"
  },
  {
    "url": "assets/js/7.9372caef.js",
    "revision": "f58a2f27ae9e7f6f0b2dea03afe1d7a8"
  },
  {
    "url": "assets/js/8.5825444f.js",
    "revision": "82b88323fbc32a6f7cbeca97d9d93398"
  },
  {
    "url": "assets/js/9.a76192d5.js",
    "revision": "a22cabe6078f594ba2208f319fcbf87e"
  },
  {
    "url": "assets/js/app.82abb434.js",
    "revision": "0500b6b1041bdfafaf5c001986da3e1b"
  },
  {
    "url": "assets/js/vendors~docsearch.4a1fb7f1.js",
    "revision": "54580ebeb592c92ef9d25716497bf914"
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
    "url": "guide/cli.html",
    "revision": "b22f7e93f139e9a56cfe5c4efad9cf7e"
  },
  {
    "url": "guide/cluster.html",
    "revision": "b8184013a62188151a1c15f3d39a6c29"
  },
  {
    "url": "guide/configuration.html",
    "revision": "49d7ed2267503bd186d2810c244ec830"
  },
  {
    "url": "guide/index.html",
    "revision": "3e26f6b2039f726c8f076fd19636fa74"
  },
  {
    "url": "guide/installation.html",
    "revision": "10ed8219432cf997dc654ca277433c77"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "298aa1251ddc969040c23da3e9c12005"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "767c86c9d8734355bd2d13d89f222394"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "05e2e99175a12a5053901b85b364cdcc"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "2338aae59192a6911d15168966b0adbe"
  },
  {
    "url": "index.html",
    "revision": "785988662a70790cb22e7ff603411f60"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "62ae1f3c493a7313a0194b0bd735239e"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "33946ab5bb7facc5e54e59a0e2de62ab"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "d5475fe102ccc1a6525569e786e69eb8"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "201419af0637f7dc9a5d2c7c5c096b10"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "bc7781eb805194dc769173d6525e4d6e"
  },
  {
    "url": "integrations/index.html",
    "revision": "597d24d96c801d0b376c59740e52040e"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "fb24a859c9500697b19e23400f8aa06f"
  },
  {
    "url": "integrations/shell.html",
    "revision": "fdceb3320e0bca33837465fd33e9d744"
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
