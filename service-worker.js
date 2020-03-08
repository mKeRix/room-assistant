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
    "revision": "f66084d73eb80eea1a37fb87e0b309f0"
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
    "url": "assets/js/14.1b7b4afa.js",
    "revision": "9e0ecdedf566fcea5925e0366f16451f"
  },
  {
    "url": "assets/js/15.1e75d593.js",
    "revision": "d4c5256479833de2fadd93cd475b0c70"
  },
  {
    "url": "assets/js/16.bc5d24db.js",
    "revision": "2a5cd77817354d7e2d0259d0308916c5"
  },
  {
    "url": "assets/js/17.115607d2.js",
    "revision": "1d46ba0f82c67374c77d9c85d68e5631"
  },
  {
    "url": "assets/js/18.f24b7b10.js",
    "revision": "9f242fa0a3ed87d30a4b4e2787e4e177"
  },
  {
    "url": "assets/js/19.cf396ba6.js",
    "revision": "02eec2ffdd249ff53cc12be6d4d609cc"
  },
  {
    "url": "assets/js/20.8bc7cd2f.js",
    "revision": "80afdb506d8c075a61a860d8150442f2"
  },
  {
    "url": "assets/js/21.3144b23a.js",
    "revision": "8eb6a34b9f20369e084e1a2e3c159aba"
  },
  {
    "url": "assets/js/22.20f18cbf.js",
    "revision": "c99862261dc62fc0724001c593907029"
  },
  {
    "url": "assets/js/23.b3e12275.js",
    "revision": "525856b13c6b8111a8b554f7949aa8b9"
  },
  {
    "url": "assets/js/24.4a8bf004.js",
    "revision": "5f224635e125716833b4d607ee239627"
  },
  {
    "url": "assets/js/25.2925a862.js",
    "revision": "3f32cc4e17ec3463e25a43f4490a6d5b"
  },
  {
    "url": "assets/js/26.233fec51.js",
    "revision": "05a1bdd8fe9ec5af9d8bec5527d18fc9"
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
    "url": "assets/js/5.eea95714.js",
    "revision": "139b3b85b5cc5413172d373cfc3f788a"
  },
  {
    "url": "assets/js/6.7b1242b0.js",
    "revision": "8664657af2a6ec7a5655016f05474431"
  },
  {
    "url": "assets/js/7.704b3d3e.js",
    "revision": "047f3d675376bc20ab2816ca7eea864d"
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
    "url": "assets/js/app.b5e8b1a1.js",
    "revision": "c338ba25bb4c1d1a1f749bb5125cc597"
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
    "revision": "0afd9612f92b97f603b13ba1281d3625"
  },
  {
    "url": "guide/cluster.html",
    "revision": "6ab261cf68d55ea75a94bd7260d6d14b"
  },
  {
    "url": "guide/configuration.html",
    "revision": "d984fc9060c118c77e82dab1f05ec884"
  },
  {
    "url": "guide/index.html",
    "revision": "f33a638c8dd8edb22547d566284074f9"
  },
  {
    "url": "guide/installation.html",
    "revision": "fd1f42cca59486403ed482cc7012877f"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "bc34d7b082f62150256915dc2bbbd112"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "bc359b8fd38b075fce39d347bca8ca95"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "a0e161060c51b30abdf831359d5d0c0b"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "d70661c147e71e4e437a2b886214a955"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "b376b1a76238da4f6778d6e46a0cef12"
  },
  {
    "url": "index.html",
    "revision": "04d92e90454edf5bb74ed234b65e15eb"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "c4426524bcaffaf46168918b77fe12aa"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "46e749a0fef57328713618bff4bbbd80"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "d6ca5c15f7cc72d8827a5c9741d1f59a"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "beaf104bc036a6bcb5021aba726b219c"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "dbf89cab81b48315d13a2068de527dbb"
  },
  {
    "url": "integrations/index.html",
    "revision": "70f02ba7776be9c9bc485304fb2506a7"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "17f081dbfbf604b8d5684e516a535093"
  },
  {
    "url": "integrations/shell.html",
    "revision": "799809c7753b8dd61a847dc930f998ed"
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
