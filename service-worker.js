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
    "revision": "071c4ddbc9a70da8f864839b3bb29b40"
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
    "url": "assets/css/0.styles.48ba20e3.css",
    "revision": "ad0eb4003ff3ae6c09aa10c2d17f49fb"
  },
  {
    "url": "assets/img/compilation-msgs.0260ae46.png",
    "revision": "0260ae461e640d240d857c5c03220685"
  },
  {
    "url": "assets/img/mijia-bind-key.02122d10.png",
    "revision": "02122d1053f90c3b6229d409b7761deb"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.77d81241.js",
    "revision": "baf9317c31b39d857548917c3868ab8d"
  },
  {
    "url": "assets/js/11.816a9894.js",
    "revision": "b88c4abe48a4fa5af1e24f1848fe3bfa"
  },
  {
    "url": "assets/js/12.9e340a53.js",
    "revision": "330bbd52fb692b48a5213b7d3c1f4125"
  },
  {
    "url": "assets/js/13.c7b639df.js",
    "revision": "9cd710cc33c47b148b09bd31d0fc6858"
  },
  {
    "url": "assets/js/14.852da295.js",
    "revision": "41380030ab9a30c1015f30182f04b08e"
  },
  {
    "url": "assets/js/15.d3fe7f25.js",
    "revision": "48eb2047c3dfa8c3fd2b72b550119d62"
  },
  {
    "url": "assets/js/16.ba5ad205.js",
    "revision": "3d4913d7ddd9fc24627598bd7aeb5fdc"
  },
  {
    "url": "assets/js/17.6b2e50af.js",
    "revision": "2d2790d05a9f873c4cdb978b449d97b8"
  },
  {
    "url": "assets/js/18.1222d6a6.js",
    "revision": "3173dc718e3dc50ec1fc7a8c16baedb4"
  },
  {
    "url": "assets/js/19.bc2f002b.js",
    "revision": "b26b7a88e8bed5ecf71b6533d348d29c"
  },
  {
    "url": "assets/js/20.f022b64c.js",
    "revision": "71f57954007c0e9384f739a89d5b06f0"
  },
  {
    "url": "assets/js/21.276cbcc5.js",
    "revision": "24ffff8557130d6eef707eb809585753"
  },
  {
    "url": "assets/js/22.cddc067c.js",
    "revision": "a16316a87dd7ca7ddf0ee39cabf298f4"
  },
  {
    "url": "assets/js/23.5b50f897.js",
    "revision": "fda867acb8e9c841747cbe51c7a775f1"
  },
  {
    "url": "assets/js/24.bd63e733.js",
    "revision": "69759e134d60e46f559f37db66d7c4be"
  },
  {
    "url": "assets/js/25.8a49d873.js",
    "revision": "a460a06405d51e3bd3e29aa900ce2352"
  },
  {
    "url": "assets/js/26.19605c73.js",
    "revision": "256f32f2f72f640dd9dc202f4a1187f0"
  },
  {
    "url": "assets/js/27.13db5b13.js",
    "revision": "6d3d17605bb01cecae659f556b19ac5b"
  },
  {
    "url": "assets/js/28.f3b57b5c.js",
    "revision": "f48c133abb63a2c0141fead7f99aaeb7"
  },
  {
    "url": "assets/js/29.a4766b27.js",
    "revision": "39ae33b4a5a0a3b3798389fd307fe343"
  },
  {
    "url": "assets/js/3.a98801d5.js",
    "revision": "442f932539909fb875f9e5b2613edefc"
  },
  {
    "url": "assets/js/30.a87b4800.js",
    "revision": "8cae8a7ed905189c11b1eab01490af45"
  },
  {
    "url": "assets/js/31.564d1b2a.js",
    "revision": "84d27a333a22c4bfbcd3f1f1406ec208"
  },
  {
    "url": "assets/js/32.67cf973e.js",
    "revision": "4feed54b5860829b1c8933427d2af09d"
  },
  {
    "url": "assets/js/33.a7db9174.js",
    "revision": "cce350867407931fc73e54c1c388f4c9"
  },
  {
    "url": "assets/js/4.efb94c99.js",
    "revision": "ac22832cdbf19fa3b830212812fe7499"
  },
  {
    "url": "assets/js/5.d9380f48.js",
    "revision": "5c0f78a2db9c4001d04656ef29c4e361"
  },
  {
    "url": "assets/js/6.07156be1.js",
    "revision": "20c8f49ee0bd4ecd7f3271ac31337cfb"
  },
  {
    "url": "assets/js/7.481731c7.js",
    "revision": "28fc245f404dd33525072f7b699898c9"
  },
  {
    "url": "assets/js/8.fffbb86a.js",
    "revision": "908f3b2117f8f5c87d32b24bf3eb8d1a"
  },
  {
    "url": "assets/js/9.34639ffc.js",
    "revision": "b220dbddaf47f4a605a6035ad92939d9"
  },
  {
    "url": "assets/js/app.a6e13c1e.js",
    "revision": "a50b95d491c992ad00880947b3519ff4"
  },
  {
    "url": "assets/js/vendors~docsearch.eec9cc92.js",
    "revision": "bc8a3e4a2fa0b7efddc04c11bb7a21a3"
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
    "revision": "cceaac8d47b7cbe5c3a3a9b1637298f9"
  },
  {
    "url": "guide/cli.html",
    "revision": "ec4bd61416fbf63fcf007d037e04ba35"
  },
  {
    "url": "guide/cluster.html",
    "revision": "15837859b2f7eca55bfd9c5152956870"
  },
  {
    "url": "guide/configuration.html",
    "revision": "17a54b16441394a56b9f7f693ef51029"
  },
  {
    "url": "guide/entities.html",
    "revision": "6f62a7569af7d009b8d2a1b6092210af"
  },
  {
    "url": "guide/index.html",
    "revision": "872df4bf4f30d0ada305f2f75b4c750a"
  },
  {
    "url": "guide/installation.html",
    "revision": "04fdc092cec3c0a89ebb5024809a680b"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "5ed08dd8eb75ce09ecbe6e9e407fb406"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "3734784c822c2ce47fb63b13fe5d637a"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "520a442a1b34170dfcb3636b898d74ba"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "25e35ffe14b8d7ad70e709524f9f05a6"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "a828f3abd9ea77bf06d82e7f5edaec80"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "44a026d7464d02ce73ca85cf598f5e13"
  },
  {
    "url": "index.html",
    "revision": "fb9ee374cc2099bca2da79c8f69a9555"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "748a852d41ad7078ad35bb54dee2e700"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "1a50cec4d044189032966750755c0dcd"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "5547624f902cfb7d0b2609a3bd197cf2"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "8a5fbc677d642392fa10ca6f62e097c6"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "e01ac0167392ee03e725f472c3c883b1"
  },
  {
    "url": "integrations/index.html",
    "revision": "dbf9ca8cabde6f311855717428af6109"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "f92310cb505fddca7e6f3ea60bbc5ecc"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "93f1bd2b1674212314a18958b2802134"
  },
  {
    "url": "integrations/shell.html",
    "revision": "55b55c85ac39cd62f2974262a2459428"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "b7bc4f5c6dc9a1986eb0797f33a5d4ff"
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
