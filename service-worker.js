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
    "revision": "86721f511989592fceee04afc4ff85c5"
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
    "url": "assets/js/10.a81fa0cf.js",
    "revision": "0ff5e95e443b36f5da283010c7338122"
  },
  {
    "url": "assets/js/11.07bda8a7.js",
    "revision": "9f7984f52a6d22b40db4df11c25b8c70"
  },
  {
    "url": "assets/js/12.9a74024d.js",
    "revision": "55d02092be5470920505c0421ac2649d"
  },
  {
    "url": "assets/js/13.5ad86907.js",
    "revision": "4faa80fd1ec8f39f1eb47f8fb97dbd12"
  },
  {
    "url": "assets/js/14.facbb4d2.js",
    "revision": "d2dc1241f0bc378e78a414ef0765c6eb"
  },
  {
    "url": "assets/js/15.b283ddae.js",
    "revision": "78d089259b731158312e52f7fcde61d7"
  },
  {
    "url": "assets/js/16.dd49818f.js",
    "revision": "0f4c65137100bab0e5581951a8603eed"
  },
  {
    "url": "assets/js/17.250d984e.js",
    "revision": "96a423ba14385feca7b5e109eed1f33c"
  },
  {
    "url": "assets/js/18.96b61801.js",
    "revision": "575e03da9e3b9c9c643af093de605ac3"
  },
  {
    "url": "assets/js/19.52ffb0c3.js",
    "revision": "0417d682c1a94ba313fa7e1abd0b62de"
  },
  {
    "url": "assets/js/20.a5b7f324.js",
    "revision": "d891283303df9b14df80c4c454899503"
  },
  {
    "url": "assets/js/21.a26f2633.js",
    "revision": "26cc39e028435d121226ecba205946ba"
  },
  {
    "url": "assets/js/22.24561241.js",
    "revision": "10d896f1ace0c44843332a69b9d0c936"
  },
  {
    "url": "assets/js/23.dcfa44ca.js",
    "revision": "2757601c0fc836e0e76c76a9c1803dea"
  },
  {
    "url": "assets/js/24.d47bf453.js",
    "revision": "8dd34024ba919a21fdde91cfce52da41"
  },
  {
    "url": "assets/js/25.35f64fa0.js",
    "revision": "de552c0a4f800f204f90f49d1ba282e8"
  },
  {
    "url": "assets/js/26.3acbfb0f.js",
    "revision": "420f85ff7db6bdecc0f272fe615e7948"
  },
  {
    "url": "assets/js/27.926f1209.js",
    "revision": "5ce8cc10a86b0a24f4a2c49ad78c1fed"
  },
  {
    "url": "assets/js/28.cfb60cbf.js",
    "revision": "31e91893838b467bc878b192c889066a"
  },
  {
    "url": "assets/js/29.d39864dc.js",
    "revision": "16ab42dddbca8b89e6f6ee646caaf857"
  },
  {
    "url": "assets/js/3.a5a90e99.js",
    "revision": "fbba5e1f02cae08a84f3e9d33e70f118"
  },
  {
    "url": "assets/js/30.83383161.js",
    "revision": "1e53acb390d4052e10674ce749e7bc72"
  },
  {
    "url": "assets/js/31.dd835afd.js",
    "revision": "62d634d642689c607c87b2a3f5d8b609"
  },
  {
    "url": "assets/js/32.1637358c.js",
    "revision": "d0a45a9457833a3af22a7e817645a94e"
  },
  {
    "url": "assets/js/33.82d635c8.js",
    "revision": "1e1365e7bb8510c02716a09f71db7026"
  },
  {
    "url": "assets/js/4.8ddcff98.js",
    "revision": "5de878505d03709e6f1df2807aa54d05"
  },
  {
    "url": "assets/js/5.7e9e3e68.js",
    "revision": "89cbff024c36ea69913bc31edb1a3b2f"
  },
  {
    "url": "assets/js/6.dc742a8c.js",
    "revision": "1210684951a371f31b407d4a51a7e103"
  },
  {
    "url": "assets/js/7.4085e0ca.js",
    "revision": "142491961edb93e8357943598e539aeb"
  },
  {
    "url": "assets/js/8.ea1e9643.js",
    "revision": "f40cce14ae015e54f38945ca07a3d55c"
  },
  {
    "url": "assets/js/9.186b46a2.js",
    "revision": "fabe95d2ae16621630ec12fff57f9148"
  },
  {
    "url": "assets/js/app.077aad19.js",
    "revision": "09010f3deb02e0758c20ef3d7ef3341b"
  },
  {
    "url": "assets/js/vendors~docsearch.a4031134.js",
    "revision": "75eb05d8fc55f458652bc50d798f8dfa"
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
    "revision": "dc1c16a2840d2b8a76e9d050ed157481"
  },
  {
    "url": "guide/cli.html",
    "revision": "4c75706d07033cc8d7a4ebf6fc1ec4bd"
  },
  {
    "url": "guide/cluster.html",
    "revision": "e9e04e381eba918f5a6c69d131485482"
  },
  {
    "url": "guide/configuration.html",
    "revision": "b73a6ed6167a2a0791d0f7d87dfef2af"
  },
  {
    "url": "guide/entities.html",
    "revision": "6b79a748b1b4c01c5b7007ad8b86f9be"
  },
  {
    "url": "guide/index.html",
    "revision": "873838b0e74906a14da44e88aecca144"
  },
  {
    "url": "guide/installation.html",
    "revision": "3c7ed6295ff19017fd1aa0230ddecbeb"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "0c19550ea27b583eb82c3d3a7a387bb2"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "0cca769fc9a4bc947eb45b10f210f3cd"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "31f6f41c62d1eec309180e61da0abc51"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "cee5ec7f1c28cc7c3e0397996353c5fe"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "722cca9596ae34bafc45bf9bdc791cdd"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "6fbb59729b81963feabb2a7b63e22123"
  },
  {
    "url": "index.html",
    "revision": "b3b8348a753571878a2a0c7921dbb958"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "2ac2af03d9607f9a8ae1dde51dc207c6"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "17fd92166854475ee69ecc83db71fbe8"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "396f54a31031ecce64cfdf1a34917b3f"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "d73310fecd2948d5f0fcd79b11d86f5e"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "7fc066b3413d43b5afe82e17debdfdb3"
  },
  {
    "url": "integrations/index.html",
    "revision": "e69edbdd9081aa4d37bb993e30865536"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "cac0cadae36e06018bb8b37a6cbc9d04"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "aa25c2315ab444a43390f41abaa9feb2"
  },
  {
    "url": "integrations/shell.html",
    "revision": "3d264b34c206c21a651c5dc871b8e2ce"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "306c17ad30ff79cb8bd4104d437e4360"
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
