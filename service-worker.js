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
    "revision": "e509e0fad09156daa1e29965dd4d3fc7"
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
    "url": "assets/js/19.1cb15d66.js",
    "revision": "8863e95bbe49fbd0061db6ca74ff2978"
  },
  {
    "url": "assets/js/20.0815e91f.js",
    "revision": "d84e37663734b43cdfb570b5609796ce"
  },
  {
    "url": "assets/js/21.e39c35cc.js",
    "revision": "64a5cc0475e68c48f1912aef0979a030"
  },
  {
    "url": "assets/js/22.2cf88b7d.js",
    "revision": "b91bf0ef8024e653f71b0362fb5058dd"
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
    "url": "assets/js/app.ca9ebcbe.js",
    "revision": "0749927ac404e106fc9b8e347daccc28"
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
    "revision": "c94c032d299f574c89d3950e871c0250"
  },
  {
    "url": "guide/cluster.html",
    "revision": "010bf8a967e82793eb4e353a64da1c40"
  },
  {
    "url": "guide/configuration.html",
    "revision": "6a32a04cf42de5ff1f6e9d4c03cce0ed"
  },
  {
    "url": "guide/index.html",
    "revision": "134ff198afc22eb83fb28ff62b1b01ad"
  },
  {
    "url": "guide/installation.html",
    "revision": "c1e0aaa23539896e8a7e16bac1451f64"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "7de2e40468505ec3d7fc3fe18a83e30a"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "cde0c4ee70feafb8a068d450d825ced0"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "f4fafcac4c7f7f69de1e2d40286f4693"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "12e0c3ac4254469a4974c5a73522ec28"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "cec524cd8767684eb78047c8391a3bf6"
  },
  {
    "url": "index.html",
    "revision": "f7350b96a3461c0919c5ddba33b77d45"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "e13b84286467a3e753e054359620592f"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "f7f062e828ebdcd2f4a3802d48e2594e"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "4ed7961ac3664dc9564a8bf3f83f1929"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "a6749c9f818de5baf7aeda66ce3c0355"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "5884b9a79be5da11863eafc7795fcee3"
  },
  {
    "url": "integrations/index.html",
    "revision": "b8a6ad2652f94b259d79d93d6c528ab1"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "f1b43a702946898bc7ddbabb4942981a"
  },
  {
    "url": "integrations/shell.html",
    "revision": "d81094e19db7fef1b49766c1f6747885"
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
