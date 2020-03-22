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
    "revision": "4392a1b086b7bf22ce401fa3d7c3f5bd"
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
    "url": "assets/js/20.97f980d7.js",
    "revision": "8e5fd6aaff34501017ac15fbbaa778ce"
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
    "url": "assets/js/app.da92d76c.js",
    "revision": "c4f400315ebd3dcb3506c83503853b3a"
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
    "revision": "119ad367ab08a56596adf432bb03504f"
  },
  {
    "url": "guide/cluster.html",
    "revision": "b51235f3a9900ee7244ad1bdf1eba5f6"
  },
  {
    "url": "guide/configuration.html",
    "revision": "b830bb8805a348aad68308d4b05dbbc2"
  },
  {
    "url": "guide/index.html",
    "revision": "1defea0c6645e330549c508687a61c20"
  },
  {
    "url": "guide/installation.html",
    "revision": "56966d0f58fb3ca568861eb2b17953e6"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "563ef15864a07a94b627eb64632bcc09"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "98d2762970a25e5596ebbe02fd3c6081"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "82a0db5e586720722dd2c93414aed971"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "168c3272608d1636b8233454ecbec819"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "3da3db0859f88dea3eeeec19736114d4"
  },
  {
    "url": "index.html",
    "revision": "7ff44938305a8330f4879bad42bce244"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "d58bc6c89c8620b664cd5a9b81a8f23f"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "46cad68c79e323827bb0f18581d54a21"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "9444956e2eebdb0fa5c285deb77b8398"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "7ea4a5b855c3fb00df21681be3048315"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "d8ffc475f581399cbf1670954f0ba391"
  },
  {
    "url": "integrations/index.html",
    "revision": "eb229b2f705302e4a17b87335b0c4ecd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "7a025e8e13c0b30e7cc08832575b10e2"
  },
  {
    "url": "integrations/shell.html",
    "revision": "6a6147b1cd57c43b22b6b2a9969bb65e"
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
