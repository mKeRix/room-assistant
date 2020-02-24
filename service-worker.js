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
    "revision": "a3602d6e02bd4613a9ca5d416511b9fe"
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
    "url": "assets/css/0.styles.6ccafff3.css",
    "revision": "3928fb544e442597af5b20963eadcb79"
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
    "url": "assets/js/10.5da190b7.js",
    "revision": "482e1fcc657b2b3e2f3669153e1d31c5"
  },
  {
    "url": "assets/js/11.1ba77a68.js",
    "revision": "4c2f06e1ed453ee0177c861295998c1a"
  },
  {
    "url": "assets/js/12.935b4787.js",
    "revision": "a23c98d1864aa8b78bd0af279976ea5c"
  },
  {
    "url": "assets/js/13.3b2fba37.js",
    "revision": "98d7bfb5f5a30768b3fa63f0bd00c9c4"
  },
  {
    "url": "assets/js/14.4064861a.js",
    "revision": "68e1d8484ff618ad9e7c75ff992e5219"
  },
  {
    "url": "assets/js/15.88493235.js",
    "revision": "ea2f2584ff918007bf793855f71f32fc"
  },
  {
    "url": "assets/js/16.71ca192a.js",
    "revision": "2ce5257795fe722c8a979d0774267e71"
  },
  {
    "url": "assets/js/17.2623060d.js",
    "revision": "63738e3900ca020bb55d8f560be3cf49"
  },
  {
    "url": "assets/js/18.2f7b73b6.js",
    "revision": "7b798bbb6ce8f1d16a394bdc2aa5f03e"
  },
  {
    "url": "assets/js/19.5ada8b56.js",
    "revision": "8d4022048a5c3e28a75aa66b1f526a89"
  },
  {
    "url": "assets/js/2.e7ad976a.js",
    "revision": "ac92b7955ba897acf4ef004d6ad64aa9"
  },
  {
    "url": "assets/js/20.908d7835.js",
    "revision": "f73ef25c50302473a03f966a4c880aa1"
  },
  {
    "url": "assets/js/21.3e104275.js",
    "revision": "127011bec9403e4088ae9c5f081f0842"
  },
  {
    "url": "assets/js/22.cffac262.js",
    "revision": "ab27e23b7545f17947f5d6743ac186b1"
  },
  {
    "url": "assets/js/23.02f26d80.js",
    "revision": "451e83564129422b05602f93b0cb1874"
  },
  {
    "url": "assets/js/24.32956688.js",
    "revision": "b92f90cae58bb5546e24e685bdb7c625"
  },
  {
    "url": "assets/js/3.d6a74d68.js",
    "revision": "3dce7c90758f2c7fe096676589d33efb"
  },
  {
    "url": "assets/js/4.11eabc96.js",
    "revision": "53957f3bfb23b744b402aacbeafcb19c"
  },
  {
    "url": "assets/js/5.7197924e.js",
    "revision": "70834081f5cc613d7d344480d3e4bb7c"
  },
  {
    "url": "assets/js/6.291c02fb.js",
    "revision": "524278e4a1d76cba1b160caf5e9da543"
  },
  {
    "url": "assets/js/7.2c9e144a.js",
    "revision": "e21c946efc6fad5398d204464006bef2"
  },
  {
    "url": "assets/js/8.7d96ab1e.js",
    "revision": "52ec3b3c8f457d02e046809a8b203fa9"
  },
  {
    "url": "assets/js/9.93c70f74.js",
    "revision": "1032fa0d0c8316bb62736ecd96babd66"
  },
  {
    "url": "assets/js/app.32b54bc7.js",
    "revision": "2ce59bdc46c725af5daa1142cbb065c6"
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
    "revision": "a8d9153cdaaddcd133a5b64cea0ac21f"
  },
  {
    "url": "guide/cluster.html",
    "revision": "82dd6065722d7256607a6448115a8b29"
  },
  {
    "url": "guide/configuration.html",
    "revision": "3103e0d44b486b5445459e19825db5dd"
  },
  {
    "url": "guide/index.html",
    "revision": "a775ce45b03fd52809098cec1e1a12c4"
  },
  {
    "url": "guide/installation.html",
    "revision": "2c3dddab753993918f42d42aabc302e9"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "46bd42d807788e26ef4028f9ca8c99b0"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "5073eaf6c9bf9d2b65fcbc9c24fe9f73"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "6b4cbf8453a36603a94c0c5c35f273d6"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "da505a77c0a05b70b5fb93c61931e4a7"
  },
  {
    "url": "index.html",
    "revision": "b75b3184dfb4bf25c47ea2453352c5e6"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "b279c9ce2b17111b13a2f674163e8384"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "86f49325da9901e619b3645eaf7a6d47"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "3e8cebbfff3932458e3eca8f1f19d9b1"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "1fed043e77252c9d2c85323c279dd1cf"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "1128407a8c1d4c23aa5d05d1947b3695"
  },
  {
    "url": "integrations/index.html",
    "revision": "f1f5edc9bb18f75f98674890c2a6f8e9"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "88cd2e2706e06847a59bdffb00272b70"
  },
  {
    "url": "integrations/shell.html",
    "revision": "00d45135f23564b7f560e6c41fad1fba"
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
