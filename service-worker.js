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
    "revision": "7bbff5b6d8f6a80fb2c85cb7c6c34ae0"
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
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.ecd12200.js",
    "revision": "6a8bc39b99f1e6b5520314b112bb413c"
  },
  {
    "url": "assets/js/11.2cd9f04a.js",
    "revision": "239bfbe9c6601aa1c64886df7657ea96"
  },
  {
    "url": "assets/js/12.a20091b3.js",
    "revision": "03758fd92d042952fe4277ced721f9c4"
  },
  {
    "url": "assets/js/13.e6fa1471.js",
    "revision": "14b46ba2a031be5eb5d9e697d9886610"
  },
  {
    "url": "assets/js/14.18ea4a56.js",
    "revision": "561965d799e093bebc0d9472286aeb86"
  },
  {
    "url": "assets/js/15.179077ac.js",
    "revision": "6ba9d1d83b10a44af99933b9259a6890"
  },
  {
    "url": "assets/js/16.f3f69186.js",
    "revision": "1e1e3ca436c7d368d22f80e9eee59f40"
  },
  {
    "url": "assets/js/17.c32495f5.js",
    "revision": "b1148fac44e33587d54de5121fb16979"
  },
  {
    "url": "assets/js/18.73bcd255.js",
    "revision": "652e713100613db79ecc25a8dafae63c"
  },
  {
    "url": "assets/js/2.d7159a1c.js",
    "revision": "59404bd7ac97f5a7ced7ded0f3e309dd"
  },
  {
    "url": "assets/js/3.7045207d.js",
    "revision": "af2109fa65ff65954ea8bd9bae639eeb"
  },
  {
    "url": "assets/js/4.b89cb9c6.js",
    "revision": "f41e726e0e24f72c4e4a92736d5c16e8"
  },
  {
    "url": "assets/js/5.a6d16c77.js",
    "revision": "127204dfdbe7fb057ade27049d27df37"
  },
  {
    "url": "assets/js/6.e2856513.js",
    "revision": "04a00b6a2881d802cdebf907b0c4a7ef"
  },
  {
    "url": "assets/js/7.b09d797c.js",
    "revision": "f0472e54f78bca0913db7f129055d172"
  },
  {
    "url": "assets/js/8.04a9a665.js",
    "revision": "fcaf6814547edac5c794736f1ebec07e"
  },
  {
    "url": "assets/js/9.a59f79a2.js",
    "revision": "d01618cdb6f5869e06cfa69778533fc9"
  },
  {
    "url": "assets/js/app.17f4ce03.js",
    "revision": "5ad87310bfaac0c58c40322715295d87"
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
    "url": "guide/index.html",
    "revision": "10825f4e216d90690bb0afcd927caeb4"
  },
  {
    "url": "index.html",
    "revision": "253ad2efbaa0f7dcf2efe06a059662d5"
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
