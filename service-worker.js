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
    "revision": "350f4349ee679668edf6d65cd48e4cd5"
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
    "url": "assets/js/app.b188f352.js",
    "revision": "e3ec0c0b6cb36e895a210b977c72638b"
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
    "revision": "42498440d423c4374bfa71cf92e9ae84"
  },
  {
    "url": "guide/cluster.html",
    "revision": "fd5402b48148fc2d8d253dd4527a6f11"
  },
  {
    "url": "guide/configuration.html",
    "revision": "af81fc212c8cbedb78f4124be4dcc2a1"
  },
  {
    "url": "guide/index.html",
    "revision": "b919008db32dd3fd5148bfc9b8eb4bff"
  },
  {
    "url": "guide/installation.html",
    "revision": "1f938964cc10bf9d6544bbc95e2c2e95"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "659efef8113b3613dc1f5dbc3efcd31d"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "c8ba1652c0eec20197c8717c530cb35a"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "5633df479314f727d52593ff6583358b"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "66b22222cf751b2ffe28d4c769437e91"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "ec0a098611007a91d7ed96dd9bcb8fba"
  },
  {
    "url": "index.html",
    "revision": "c0f171d97f21a3ed8ef8685200d9ba61"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "946cf0e689a0fc3fc83c5c7ce925a086"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "0c97bc25dace924803ed4ed724fe55c3"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "fd370741662140654980e05cc0ef05ff"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "19896d30fc87dea9322e48dcec3cd98a"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "a16a75444cc39ab8f5bb04c66d3ac789"
  },
  {
    "url": "integrations/index.html",
    "revision": "2c3f23439015b6f8c0ec398cdb52e174"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "f6c2bc0a2905ea686e2183ee4367bbf4"
  },
  {
    "url": "integrations/shell.html",
    "revision": "c2ff881f641faedcb2ce7c8fd6d3e143"
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
