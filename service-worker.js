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
    "revision": "70b8160f1a9593cb41dad3b041aba934"
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
    "url": "assets/js/10.8e5a4a49.js",
    "revision": "f50686d57b808ce8fb02869758391a83"
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
    "url": "assets/js/9.24960d3a.js",
    "revision": "2fa2ed58973285271e17f80a02df133d"
  },
  {
    "url": "assets/js/app.68e42105.js",
    "revision": "a8803acce3f2324eaa56e60f24143574"
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
    "revision": "bf5fe142d093c66d9b1ec10a1ce564b7"
  },
  {
    "url": "guide/cli.html",
    "revision": "79f9517a9178df1c719483cebcd2c611"
  },
  {
    "url": "guide/cluster.html",
    "revision": "dd3375bd8efab0108932479a610440a1"
  },
  {
    "url": "guide/configuration.html",
    "revision": "8ab4202bfea738033de67c99e5191c0c"
  },
  {
    "url": "guide/entities.html",
    "revision": "500039d3c8c03275e721ac4759bc5cbd"
  },
  {
    "url": "guide/index.html",
    "revision": "b338ba303d950931fa600c5f01cf8254"
  },
  {
    "url": "guide/installation.html",
    "revision": "c895eb4cba75e2756941dac781e7a0cc"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "b59c71541d4ada1a6b2abd57ee5f4829"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "85b8b67aece0f3626aad7187699bf23b"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "b34bf53b780b52f27b7add10ad4c331f"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "0cdaf8a9ec8e77dbfd4aea3493ed093f"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "238ec2b16be57674c2e23e34c6eeb31d"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "0ebd67af09366f0514f9962bafa7d596"
  },
  {
    "url": "index.html",
    "revision": "c7690658746299a3468b87f2a6c1cfc9"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "5a0ab85ab63258ad7707d05584f93a79"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "1f2bf21103be757428013fd687c3442d"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "5e9e17e0bc24157aa3a38566c0bebcd5"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "174b1e1d01b69141257a17a2e692c2e0"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "73432f20e110dd197acbaa0ed85677b4"
  },
  {
    "url": "integrations/index.html",
    "revision": "74aa0efbc019e7b6da2f9de2f85071ff"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "bff56189c52bf5e560ad956eebb93bf9"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "94f9f34aad51d40c21adc4d509f5c18d"
  },
  {
    "url": "integrations/shell.html",
    "revision": "0018a778fe66fd9c8febdd7a86271829"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "d5cfe4d31d9deaf42bd9d2231a93a2e1"
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
