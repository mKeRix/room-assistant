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
    "revision": "bdfb891e5f61f2678c7664260938e578"
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
    "url": "assets/js/17.ba2809aa.js",
    "revision": "98c6ceb6c56dffedb1604a265ac4b17f"
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
    "url": "assets/js/app.3d1114c8.js",
    "revision": "845235334af2f8642a2e9ef7cb454862"
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
    "revision": "f4ae33301327714badb4f60efc503cdf"
  },
  {
    "url": "guide/cli.html",
    "revision": "b756db06e7574066dbfa5965cbfa7a87"
  },
  {
    "url": "guide/cluster.html",
    "revision": "53cadbe91987727b731ea152cb75ad84"
  },
  {
    "url": "guide/configuration.html",
    "revision": "a49ac651e89360ba6ac0066bdc9162e1"
  },
  {
    "url": "guide/entities.html",
    "revision": "4b580d7a3ba27cffa86b8ddbd44fabd1"
  },
  {
    "url": "guide/index.html",
    "revision": "a296a30bac290ded0d7dae04b3064d0a"
  },
  {
    "url": "guide/installation.html",
    "revision": "be39df6f966598cc977e73771d4a68c9"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "56f9e38c0fa75945036b46bb83392b11"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "d865c083420a23b6909da03f1ee64aad"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "5356bd6bd3dc3f4e0837f5af7e4a488c"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "048d87cf376a6de1d58454f823a8f790"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "911d7de29e586236d1a157b3f42b015d"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "7f6dd99cf2ddc3c27a9ba2c44d07a7d2"
  },
  {
    "url": "index.html",
    "revision": "923ece9ff09c99a090546dd9a794f790"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "8b3866b87b7a5903f85e279639674b28"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "79aeda7617355d757429ad7291221cb7"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "d88370f9aebbb75fa821d58e94f77909"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "30bfd397831a2a57aca858330cdb09b4"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "6810a519882319f14195105cd4203999"
  },
  {
    "url": "integrations/index.html",
    "revision": "3570f5b35f89623539d4ce5cd414138b"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "e30503a2c912c3da22765b141c787c6b"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "964ad499826cfd115f6de26fc9a3825f"
  },
  {
    "url": "integrations/shell.html",
    "revision": "ff5d219b71452d1212a1757c95f47c8e"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "9a65ea9b8027a90b5bc666925163e96d"
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
