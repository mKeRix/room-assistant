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
    "revision": "3ef9a9cd4c1ef91a33d1a4835f9c6624"
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
    "url": "assets/js/10.bdedbafc.js",
    "revision": "52387bd21867bf146922bcd6084fb5fe"
  },
  {
    "url": "assets/js/11.d4613e7d.js",
    "revision": "313856653abe8ff23a4d90c063677be1"
  },
  {
    "url": "assets/js/12.ec3d73a7.js",
    "revision": "6e3341810a506cffc3af9e692a0f881f"
  },
  {
    "url": "assets/js/13.d415e004.js",
    "revision": "c71dcfa95cfde5055c2410c3d3d953fa"
  },
  {
    "url": "assets/js/14.f25c4bde.js",
    "revision": "d2f07bf2ff2399dd796a1681d71ff384"
  },
  {
    "url": "assets/js/15.d7abde49.js",
    "revision": "12d0a406a8558eb3d9f231727ea31f1a"
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
    "url": "assets/js/18.8eb917c4.js",
    "revision": "65e99d574b03a1afb637a9ef3c725efe"
  },
  {
    "url": "assets/js/19.678020bf.js",
    "revision": "8819ca132074e05f92f0900e22735d44"
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
    "url": "assets/js/6.ea7d203c.js",
    "revision": "6125f7e05dfb0cb9cb1606f88350d622"
  },
  {
    "url": "assets/js/7.480f4f58.js",
    "revision": "2125633b14db121e83dae1f53ccfaf2a"
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
    "url": "assets/js/app.9da00abf.js",
    "revision": "82bd4e3980d98dd5a795019eaac0dd4c"
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
    "revision": "51b1295845b28c9f9a23fcf300c8c60e"
  },
  {
    "url": "guide/cluster.html",
    "revision": "ce02be63ba1effd2b097b8bbe86fbc75"
  },
  {
    "url": "guide/configuration.html",
    "revision": "bee35d65a12bb9e69b55cfc821eb898a"
  },
  {
    "url": "guide/index.html",
    "revision": "2e1c805260e477f4311580cecea08046"
  },
  {
    "url": "guide/installation.html",
    "revision": "e8f24caca8ae0b7682678b9b2000d449"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "081ae00310bb69b065d3541989b51e00"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "07e2535948a0f5f42d83d81bbda93a3a"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "ad4fd8545b99b8bf3217d56871d63cc9"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "4c628eff330bbc771491c27c5d87e48d"
  },
  {
    "url": "index.html",
    "revision": "045bdabbdacc3f9468bcc4b334974b6d"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "d34856d72b37c34c8942c2e1955c49da"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "419a792195ab45d539ecce05ed185b5f"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "f083e2b0da3c03c8f87fcd91f44fbbd9"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "44cd34605983351193d931210907aca2"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "dde6c741cb4ee334c49f02f885b7d04d"
  },
  {
    "url": "integrations/index.html",
    "revision": "dc619587d885626a42f2f4b63bf9e235"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "cb9c353ac8a8fd2b8cd99f6fbd90ded0"
  },
  {
    "url": "integrations/shell.html",
    "revision": "dc0ddfab07f4bd0c56596f20792d954b"
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
