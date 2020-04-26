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
    "revision": "2f623684d4c3b8db4cd2f0f07e9ba420"
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
    "url": "assets/js/15.204a96b3.js",
    "revision": "843b4bd2217e4cc3346c760193f2415c"
  },
  {
    "url": "assets/js/16.bc5d24db.js",
    "revision": "2a5cd77817354d7e2d0259d0308916c5"
  },
  {
    "url": "assets/js/17.c2965f33.js",
    "revision": "1af6c8a49f6c64e57360fb70a048d1d6"
  },
  {
    "url": "assets/js/18.073b45f8.js",
    "revision": "279bdf7a16390eebf72b2f7d61ef37ed"
  },
  {
    "url": "assets/js/19.f7fcc8c1.js",
    "revision": "c8de28d488f35e6907451d39b5fac223"
  },
  {
    "url": "assets/js/20.797f18d8.js",
    "revision": "4dec1bbc02adf5e1122d6bace0b6251b"
  },
  {
    "url": "assets/js/21.a612051e.js",
    "revision": "2264237a6bb7b8b10ff6b08a98cd65d6"
  },
  {
    "url": "assets/js/22.59c99daa.js",
    "revision": "2af8b5be56bd410fa600aad82a3fa2a3"
  },
  {
    "url": "assets/js/23.2170ecab.js",
    "revision": "6ee8acd723b6d7eb01987ccbec22ec37"
  },
  {
    "url": "assets/js/24.8461a930.js",
    "revision": "186c62b2e6a928b1d06a53ec1a7b340c"
  },
  {
    "url": "assets/js/25.1ad334ff.js",
    "revision": "091fe36e4c42996219a0d0ae07339c38"
  },
  {
    "url": "assets/js/26.81a9325b.js",
    "revision": "77eb6ea032fa6f7763f3fb2caece1ca6"
  },
  {
    "url": "assets/js/27.93621802.js",
    "revision": "789e2c14d61e81f4f4cd3ca4b756769c"
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
    "url": "assets/js/5.7a7da1f9.js",
    "revision": "58225da79c4c79c14429cb4249586a09"
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
    "url": "assets/js/app.59604680.js",
    "revision": "54c780814187280b0cb8773692cb64e0"
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
    "revision": "7f5cb9e810f15650166e441968e52e0c"
  },
  {
    "url": "guide/cluster.html",
    "revision": "a5c2c04077e5a233721960610ceda30e"
  },
  {
    "url": "guide/configuration.html",
    "revision": "2d0e5747698230436a919076aefc053d"
  },
  {
    "url": "guide/index.html",
    "revision": "bfaaf3b5f25c040f6da44f01210e6549"
  },
  {
    "url": "guide/installation.html",
    "revision": "f57d4f5df3f03b5e885ece5058bfd495"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "7d66a572e66341808739d21bbf929f82"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "cb4560eed9df17cf5294e77f47fede8f"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "cee0967a0fa1379a23e9df9964e9157b"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "0abcbf7cc056633116df3d033212fd42"
  },
  {
    "url": "guide/troubleshooting.html",
    "revision": "0097d70efa63a169afaef83712200e3a"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "95693324b019740fe4b7c16891167ca8"
  },
  {
    "url": "index.html",
    "revision": "17d6a0ca3a272c7e854ad2c0779285de"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "f31386585177141c857674d4ce084d69"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "da22c99dbec9ca7a3618165474b7baaf"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "d43594e5d59e7aeeb8571e5af2245401"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "95217b191b199caefbdf37f69a75a60b"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "462dcebd8c7e8fb1e4ae7ea3bec33ab9"
  },
  {
    "url": "integrations/index.html",
    "revision": "7f64d1373f0008271bea2028feba0574"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "77c2907cbc1c38f3884966f86b3378f4"
  },
  {
    "url": "integrations/shell.html",
    "revision": "861e5fbbe5d46e8ba98f3928395f477c"
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
