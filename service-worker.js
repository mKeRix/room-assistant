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
    "revision": "460668de532a87b269289fad2bf09d24"
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
    "url": "assets/js/6.718dd8e5.js",
    "revision": "9f69946adef985ac8ad95f5a4d720b92"
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
    "url": "assets/js/9.4d26dfdb.js",
    "revision": "531a284fa9c95b6936860c3d5d58a6c6"
  },
  {
    "url": "assets/js/app.7b43db37.js",
    "revision": "c8d76ce99b0209903beb117b24295df2"
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
    "revision": "7c6241d375561b83536a338df3c65437"
  },
  {
    "url": "guide/cluster.html",
    "revision": "7939bdc1aa4c82c5c73e1284eb280daa"
  },
  {
    "url": "guide/configuration.html",
    "revision": "06b2dfd8aed14ed6ba480c9305fec690"
  },
  {
    "url": "guide/index.html",
    "revision": "a6519ccc223e93e582c34f8b2a721925"
  },
  {
    "url": "guide/installation.html",
    "revision": "1cfbef1f2570f691c1774139360e91bd"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "f5c454306bdf17426013c0a633e96a85"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "bc551b8acb4d0771913643a4fc9c266c"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "d153dc42d7440b2e166bebcfe5c52ab2"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "1de0e196a8bdab9b314e050d06a26ecc"
  },
  {
    "url": "index.html",
    "revision": "df588d9aeb5eaf66b283324a11ba7f29"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "dffbcd78b35d1bcc61048b4e0072d995"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "d54a4664c9b4daf6568fc575f6eda977"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "4639f400d2160226939dec736815b92b"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "5ab03699dbb07f02b7291d6f06314ba2"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "9a3775a8a57d20b367be80ce596eb164"
  },
  {
    "url": "integrations/index.html",
    "revision": "9a60765173e59992341e4e7bfe78562b"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "3587454318a3c255f80893116068f63e"
  },
  {
    "url": "integrations/shell.html",
    "revision": "d3ac9f34e2dbfb8b49821ee6ccc4d1e4"
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
