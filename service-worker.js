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
    "revision": "d0d07223e75193acdb940cbcbe7d6fa5"
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
    "url": "assets/js/17.115607d2.js",
    "revision": "1d46ba0f82c67374c77d9c85d68e5631"
  },
  {
    "url": "assets/js/18.6865478f.js",
    "revision": "c3dc74669f0f5b633ae51319333686ae"
  },
  {
    "url": "assets/js/19.4d7c2031.js",
    "revision": "3da7ca6b51248f97c926ad30c6a3c92a"
  },
  {
    "url": "assets/js/20.4ee63976.js",
    "revision": "cf018692dd1fcacec532f3ac47e32f0e"
  },
  {
    "url": "assets/js/21.0f37c9fd.js",
    "revision": "a44b8cba1a91452867af347e2606185c"
  },
  {
    "url": "assets/js/22.20f18cbf.js",
    "revision": "c99862261dc62fc0724001c593907029"
  },
  {
    "url": "assets/js/23.c6a5a171.js",
    "revision": "51907e8b6576095aeef9bfaa77284d4d"
  },
  {
    "url": "assets/js/24.4a8bf004.js",
    "revision": "5f224635e125716833b4d607ee239627"
  },
  {
    "url": "assets/js/25.f70c503e.js",
    "revision": "c648e47d0973b6fb2ab7c408d6ab8699"
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
    "url": "assets/js/app.b356d781.js",
    "revision": "38fee5d4c48970a3c2ea6721613df2cb"
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
    "revision": "db3e7ee0c3b0839c973c1c8933168cce"
  },
  {
    "url": "guide/cluster.html",
    "revision": "ae932859d15c6fb13446689b9d1c8c54"
  },
  {
    "url": "guide/configuration.html",
    "revision": "de246763a88f611582dabce465857826"
  },
  {
    "url": "guide/index.html",
    "revision": "24ae0b006879615dc6f82977e780a7f0"
  },
  {
    "url": "guide/installation.html",
    "revision": "e960db9ca0343417fa8b1f7f5cb74de5"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "6d6849833898d887fd58726e867d09ff"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "7bed7a771c73a854d6fde63a3163eeb5"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "710f751d0a563916f5fa2b1d7d770b63"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "4b7e529ed5957c92ca1778dbb8a97ab6"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "9e5fc18cba17de3bbbf0334380fc8b5d"
  },
  {
    "url": "index.html",
    "revision": "0fea894a2bb8a02a2a979ffb3ded4962"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "bccd2f01e456025d695d02070d7c4108"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "6b06b875aa9ea2535ccaba87beaf2886"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "ba581193a7f321fa384d25a466db8e70"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "fac56927e51f85c6e602838bbc0117e1"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "56cfc4abc18730be046dc15d8b8674b2"
  },
  {
    "url": "integrations/index.html",
    "revision": "8c0c52e9dd7f6ff1aeb5f77f4ae47aa9"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "5175c00be90503c3de7fc31e184a06f9"
  },
  {
    "url": "integrations/shell.html",
    "revision": "7b759be8bf01cb11b5388e8d207a3e65"
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
