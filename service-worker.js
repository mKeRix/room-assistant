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
    "revision": "bf58ef38bb36de9654203862a02a5cc6"
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
    "url": "assets/js/17.b5854b92.js",
    "revision": "0ea42b3ba9300386858e5c70d2ed9363"
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
    "url": "assets/js/app.9661e273.js",
    "revision": "66b9a972b6aa43a04c8531d9ce4f0565"
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
    "revision": "91f2cca917670ec3da717b2e2083d18d"
  },
  {
    "url": "guide/cli.html",
    "revision": "19c8cf5d7abec632edd3dbaa03b88ac0"
  },
  {
    "url": "guide/cluster.html",
    "revision": "cfd4c1a8dfdb429cb189f568758a66a8"
  },
  {
    "url": "guide/configuration.html",
    "revision": "11ad610b9c54758193450a7ef84d0cbe"
  },
  {
    "url": "guide/entities.html",
    "revision": "938c7ad242d2f3ed7658878adbfb6fd5"
  },
  {
    "url": "guide/index.html",
    "revision": "06211231546ce05d5c22319d1ba51f1a"
  },
  {
    "url": "guide/installation.html",
    "revision": "2cda53ffd7869f3d579eb617e8325be4"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "d4977742ea666cbd1ac35f73b52b0657"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "23df6fb0f3820352291e387e82e8c806"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "bf7bd6bb79c4799af4b844212e6ce81f"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "5d98405b3a73596f9389f381c5b8f90a"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "855f431272f8f1d0f779e4650f40d84f"
  },
  {
    "url": "index.html",
    "revision": "56208f340b5da3e9a8bd3fadbf584947"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "544654a84917832ac351d115a41dc28f"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "4636734bd5c44cddde13ae2e9ad304d0"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "6073fc829c2cb9403e11f38738ac341f"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "2234c5d61e9338939126b4bedaa26ef6"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "c0eba9e65172f2111ec787f3ad8019db"
  },
  {
    "url": "integrations/index.html",
    "revision": "00c9467fead8d471b83ccb85c1872aea"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "59ac45706f020b5d3ed9a9a7f80e8433"
  },
  {
    "url": "integrations/shell.html",
    "revision": "83641b3f54e60778a9b17d459561a7ba"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "9260148a83ca20b4d0cef6ea5bf996d2"
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
