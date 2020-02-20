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
    "revision": "54de772893b05b4fafc7c021f2fb530f"
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
    "url": "assets/js/10.7dc41b63.js",
    "revision": "673dbafbcfeb6152d0339779128c71a4"
  },
  {
    "url": "assets/js/11.1cca18fc.js",
    "revision": "8787a07c7a11c3e3e59e40d2d7a6f334"
  },
  {
    "url": "assets/js/12.72cb1da5.js",
    "revision": "d56ad41c4c24fbce493f0215f7baa85f"
  },
  {
    "url": "assets/js/13.8132c02f.js",
    "revision": "b560d88ebcaa0cbec37275cf1bdb6d55"
  },
  {
    "url": "assets/js/14.919bb38c.js",
    "revision": "2d6c33c739f370035c4e5e42cdb3df0b"
  },
  {
    "url": "assets/js/15.2dcf1081.js",
    "revision": "30fbc1d19863bf7df74bf30a86ff50c1"
  },
  {
    "url": "assets/js/16.d45c3be4.js",
    "revision": "b4e45423c0eed31d56d899046d8e302c"
  },
  {
    "url": "assets/js/17.dfeaa12b.js",
    "revision": "e3858d09d3201d7f9d8b903680e15eeb"
  },
  {
    "url": "assets/js/18.11401c91.js",
    "revision": "78b7bc2d6743a5fe24e61916e472d786"
  },
  {
    "url": "assets/js/19.a30421d8.js",
    "revision": "5fb832a5164d0266a98c9111b11de414"
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
    "url": "assets/js/4.1d62586c.js",
    "revision": "6bcbaf2896bdb97d72661d17568dbb63"
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
    "url": "assets/js/9.7c77acec.js",
    "revision": "8667f71c50bd043cd61d04aec96ad771"
  },
  {
    "url": "assets/js/app.3f0a70fa.js",
    "revision": "4be1b3435630771bc6e377c68aa74d02"
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
    "revision": "1de4575c54a623d9d7ae506aaacd054f"
  },
  {
    "url": "index.html",
    "revision": "4179fc0bbb53d9f55ed8715c0cc09637"
  },
  {
    "url": "integrations/index.html",
    "revision": "0b08a095bf0cb7c76e1765befa33e00b"
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
