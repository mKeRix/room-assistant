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
    "revision": "89651c13c7ff0ff9bdc401be592d031b"
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
    "url": "assets/css/0.styles.8932e1f6.css",
    "revision": "5e0753d0a4a670cf52ebc41a26e5d1ab"
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
    "url": "assets/js/10.de84e5e4.js",
    "revision": "11953f5b89be13c54774609c44022988"
  },
  {
    "url": "assets/js/11.2985f283.js",
    "revision": "58f93278ae4ce801b35a9d75d0d828b0"
  },
  {
    "url": "assets/js/12.2ce879aa.js",
    "revision": "fc1d6219cb4dec0ef4f487982e548742"
  },
  {
    "url": "assets/js/13.fd9eab93.js",
    "revision": "8cc1762b56c367f8344b26ff8fe5274b"
  },
  {
    "url": "assets/js/14.e97aa009.js",
    "revision": "0d3813c5093598fadbf03a98b66efab2"
  },
  {
    "url": "assets/js/15.67c543f5.js",
    "revision": "817071161f270bf845502f547edcf550"
  },
  {
    "url": "assets/js/16.c2e919f3.js",
    "revision": "54739c3fef95687443302008b400b7d0"
  },
  {
    "url": "assets/js/17.85be7069.js",
    "revision": "b0571f0cfec0f0a444fae032a722a9fe"
  },
  {
    "url": "assets/js/18.9f824c84.js",
    "revision": "1b3b29e62d878e0e5ac74a9e0878495e"
  },
  {
    "url": "assets/js/19.9a7a6005.js",
    "revision": "d3139ba5bda073871b5391569cb6a716"
  },
  {
    "url": "assets/js/20.08238b36.js",
    "revision": "49b67274f9992eb1a0affbe4b522cddf"
  },
  {
    "url": "assets/js/21.50332094.js",
    "revision": "91e27fbdfbfb2be1b262090c20e038a8"
  },
  {
    "url": "assets/js/22.09380d5e.js",
    "revision": "21354aa499b6a5e003e98623d3bccc6c"
  },
  {
    "url": "assets/js/23.1ca1bba7.js",
    "revision": "b25a4edf1af9b98d281d553f5780b67f"
  },
  {
    "url": "assets/js/24.6bc37954.js",
    "revision": "385f65c1bc75cccb12168ee23fbeae89"
  },
  {
    "url": "assets/js/25.0f709575.js",
    "revision": "e40ddecb60afc0709b01c9d4f28c0526"
  },
  {
    "url": "assets/js/26.70dc3686.js",
    "revision": "7b7cd9b99ed26133dbbfd13a94efb765"
  },
  {
    "url": "assets/js/27.0c2f63f4.js",
    "revision": "6ed4c15d1adbefbd5b176f6dd9090214"
  },
  {
    "url": "assets/js/28.caaad1c8.js",
    "revision": "1895662f96ef38ea948f6fbd0fa90509"
  },
  {
    "url": "assets/js/29.8347d63a.js",
    "revision": "a3361cb99e1689f4f9a367345a0837ec"
  },
  {
    "url": "assets/js/3.066c06e2.js",
    "revision": "24ddf1dc8e077b1f58969985c75b1508"
  },
  {
    "url": "assets/js/4.51280a39.js",
    "revision": "ae25432b6d89b4ee066fa130d9329ad1"
  },
  {
    "url": "assets/js/5.09c9c354.js",
    "revision": "668b4b9647ebe2869e81c8008995152e"
  },
  {
    "url": "assets/js/6.c899d60b.js",
    "revision": "77d5ffaafcfb8d9b15da4d5011fe2a70"
  },
  {
    "url": "assets/js/7.7e1350b3.js",
    "revision": "367da09416bfbcb04f7fb41808b498d4"
  },
  {
    "url": "assets/js/8.f366fc90.js",
    "revision": "db8beead61f511a89d13653aa9decad5"
  },
  {
    "url": "assets/js/9.870e5c65.js",
    "revision": "827f7442ed930ec2fd10acc2ade7fbc1"
  },
  {
    "url": "assets/js/app.3e47ec7e.js",
    "revision": "fe583bede19511c1297f3479da65b7fb"
  },
  {
    "url": "assets/js/vendors~docsearch.33b3cf02.js",
    "revision": "78ea1d6699b34c1f4d07a0753b96827f"
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
    "revision": "76a724bbb03eff122b0275f96b971dfe"
  },
  {
    "url": "guide/cli.html",
    "revision": "899f53bb5dcbe2ff6d28361c0bb9bdcf"
  },
  {
    "url": "guide/cluster.html",
    "revision": "f278c51a3f0bbbee8aa4b02767a2cc17"
  },
  {
    "url": "guide/configuration.html",
    "revision": "d3b64b848543de81c6519f4dc9ac2c8e"
  },
  {
    "url": "guide/entities.html",
    "revision": "065def26aecbd6d454753f391062fc26"
  },
  {
    "url": "guide/index.html",
    "revision": "e6f93120960c78a2a1149c0f45a20df3"
  },
  {
    "url": "guide/installation.html",
    "revision": "a46a0c4422fa6d4af948523cf26aacc5"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "381bfc976c1bf08318766759c9e8c8dc"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "025d11c950fc219d4cfbc028be3d304d"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "7169e2d456fa7a2c4e7dfad103c6d57c"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "b0c372e796a6fb0c6d4756cc525210d7"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "02589b8df195d216b18c03387b339acb"
  },
  {
    "url": "index.html",
    "revision": "f2b52c8c8cd127ad31709062e26027c8"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "1218426b2dffdc640b85e4e3396dda76"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "165afe1035e2238497e87b6340740786"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "20b60edb195c7ab991d8d4385a1df658"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "5b77e48dc0eaa8f06ece361cd8fda10c"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "45fa2cef8bd9053b68bd0e64d11beed7"
  },
  {
    "url": "integrations/index.html",
    "revision": "cb3661b15da0b48f67405345cef9c3d8"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "6297e96ceb24e047a36bc068f36369bc"
  },
  {
    "url": "integrations/shell.html",
    "revision": "4fb539cf34c4a38d394d077b37fae67c"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "7b7347d81c96d1ed8bace696361ff740"
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
