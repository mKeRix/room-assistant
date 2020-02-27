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
    "revision": "fed1dd7521d5f1778d34bdd3733b8304"
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
    "url": "assets/js/11.b7d9861a.js",
    "revision": "754d4cfc98e69408a75cc5b311e23604"
  },
  {
    "url": "assets/js/12.7b4302ff.js",
    "revision": "f34900c496dd9972d0a5ddfafa2ae65d"
  },
  {
    "url": "assets/js/13.cb28d499.js",
    "revision": "efdd6caebb3c9aa1b5b5dcba321c2f62"
  },
  {
    "url": "assets/js/14.f4945649.js",
    "revision": "a0a46ee19c12da03d5984a6420caa01b"
  },
  {
    "url": "assets/js/15.2a407677.js",
    "revision": "9b5aac24805d1236e0d5ff8043d67645"
  },
  {
    "url": "assets/js/16.8be42992.js",
    "revision": "5d13294c3ea30d0a81f6472419462979"
  },
  {
    "url": "assets/js/17.66fd40fa.js",
    "revision": "7e3c2fcdc4e9ce73652eb5b05aa513f8"
  },
  {
    "url": "assets/js/18.9dc7fd8e.js",
    "revision": "5e151542c473772dfc069d7ca3736011"
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
    "url": "assets/js/5.4726f6eb.js",
    "revision": "06665fc9040398323c8f10de895fbd6e"
  },
  {
    "url": "assets/js/6.8d3c9b74.js",
    "revision": "bba693d9d9898cd205419421caf0ee24"
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
    "url": "assets/js/app.92a01780.js",
    "revision": "75ef423b16eddd98f8acabacdf04b7ea"
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
    "revision": "d6e50f279ca743b645e1ab6e9f56e024"
  },
  {
    "url": "guide/cluster.html",
    "revision": "a574fbb5c0701fa69d57a0782a9491ff"
  },
  {
    "url": "guide/configuration.html",
    "revision": "4ad19a4eccba4fefdc6a52974909c86d"
  },
  {
    "url": "guide/index.html",
    "revision": "3b02cb4b6179f9f3c7a711a68659afd0"
  },
  {
    "url": "guide/installation.html",
    "revision": "617aa6dffe599090b38033675fc80b00"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "72ca1c106465e63ef769e9198e1dcce4"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "4b644fe218a616fff3a61a265d02dd60"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "eb1b2d1c119b9539055846df91f91319"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "8d147371c94a8b366747332e205083c5"
  },
  {
    "url": "index.html",
    "revision": "bc164a6c239f7d3fb85a5d6ba009ebae"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "bed59ab8c65431cb72f4ac68d983c7c0"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "ed906a0f387d771c4bfef53776ab558c"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "1debe6ea6250bc8b546d799a4e951e0c"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "f8a5e54660344e80239ecb294aeb5456"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "a5c615c9fe06c4425183f4a6cc1adb73"
  },
  {
    "url": "integrations/index.html",
    "revision": "8583467ac34f71b986ca84decc3626fe"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "2f2bbe8bf1c0ccb2f8fe78eccae9bc0e"
  },
  {
    "url": "integrations/shell.html",
    "revision": "b221c63106697fd478acc9265801a147"
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
