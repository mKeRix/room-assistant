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
    "revision": "4e1f3fcafdecb6599dad14bcd4e682e9"
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
    "url": "assets/js/10.916e0a05.js",
    "revision": "da76ef8c222bbb47df36f9d1719d63fc"
  },
  {
    "url": "assets/js/11.87fa8163.js",
    "revision": "21f9c44d671cd3f69529aadcdb049dfe"
  },
  {
    "url": "assets/js/12.c5908eb1.js",
    "revision": "620bf7c054412bfbae4d5226b97dfa70"
  },
  {
    "url": "assets/js/13.4caf99f4.js",
    "revision": "9d6c9815c803f594bfa01260b1eb80d8"
  },
  {
    "url": "assets/js/14.7f16820d.js",
    "revision": "80d2494578da887a4e52492e26a8b290"
  },
  {
    "url": "assets/js/15.fe2c55b7.js",
    "revision": "b0e39e50307e2ea30a09de660f1ecbc3"
  },
  {
    "url": "assets/js/16.6bded421.js",
    "revision": "155e6600949e7cf5c43c1e9750bfbc6d"
  },
  {
    "url": "assets/js/17.26afdc30.js",
    "revision": "21bbd536b5fd9d69ba0e2a085404bb9a"
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
    "url": "assets/js/4.dd521b28.js",
    "revision": "fd10445cb50bb0a822f363a3d3c7b511"
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
    "url": "assets/js/8.4c48653c.js",
    "revision": "c20ca79b9fc89f75b636c2a510582ede"
  },
  {
    "url": "assets/js/9.4de58f54.js",
    "revision": "d97c2fa08be9777e0f864a173fd9a7e6"
  },
  {
    "url": "assets/js/app.78ad7176.js",
    "revision": "618b21a1c6f88dad3aa8f05f58eaf949"
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
    "revision": "3d695eaf7a194e2593fbe7fd56390ea4"
  },
  {
    "url": "index.html",
    "revision": "8db6ab3964aad409fc2796c949d23c7d"
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
