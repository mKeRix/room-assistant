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
    "revision": "23315c1bb06d5fac57f1cffd45b25f4f"
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
    "url": "assets/css/0.styles.472961e2.css",
    "revision": "8eb7d559b2fdeca700d7d28b4760b2e7"
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
    "url": "assets/js/10.8cbffd27.js",
    "revision": "de5679ea246565136c5c6372ea8ce30b"
  },
  {
    "url": "assets/js/11.33515215.js",
    "revision": "514943cf93679c7f33e202ddae6cedbc"
  },
  {
    "url": "assets/js/12.85e2684a.js",
    "revision": "7ba496b2896837b2310499dc5aee951f"
  },
  {
    "url": "assets/js/13.174e91c9.js",
    "revision": "4d71bd6c5be44dbd23380c7282e7b12d"
  },
  {
    "url": "assets/js/14.99aa83d1.js",
    "revision": "e9ba91fe8517ae924d33817d7d0236f7"
  },
  {
    "url": "assets/js/15.72d67cd3.js",
    "revision": "426fd18d7c21ea26de9a76de8e43416f"
  },
  {
    "url": "assets/js/16.e1f4af68.js",
    "revision": "890710c1257e2383010f837a01e643ce"
  },
  {
    "url": "assets/js/17.bb86d234.js",
    "revision": "d521dd433c03418a78673ac3e81485ff"
  },
  {
    "url": "assets/js/18.77132ae4.js",
    "revision": "652c0e623d82e1656a84e1918a26ca69"
  },
  {
    "url": "assets/js/19.c6defd3b.js",
    "revision": "b749077ce7f291e3690ae5b6e6edda8d"
  },
  {
    "url": "assets/js/20.2d3e61ec.js",
    "revision": "b1b1acf4801e425f3d14ffc71c590b6c"
  },
  {
    "url": "assets/js/21.9212a2fe.js",
    "revision": "a4c892563163fdbbaf64bfd0e4d64e73"
  },
  {
    "url": "assets/js/22.b87d6f48.js",
    "revision": "24c87dd7a1dc3dc253447772f6d656ba"
  },
  {
    "url": "assets/js/23.ec39ac0c.js",
    "revision": "bd17c19f60b0781b73a96fef5abc176f"
  },
  {
    "url": "assets/js/24.17bb772b.js",
    "revision": "32fe25595e6f7e90da845d9f4794503d"
  },
  {
    "url": "assets/js/25.ba931808.js",
    "revision": "10aa7b777f8fb77457a4705676271363"
  },
  {
    "url": "assets/js/26.fca62437.js",
    "revision": "0ea3c157902f5076a413549af1d9a654"
  },
  {
    "url": "assets/js/27.ad981411.js",
    "revision": "7aaa561c9c31fe5d2309f251c81fa4db"
  },
  {
    "url": "assets/js/28.af54a588.js",
    "revision": "f243194cff83ef54d7f4c6997d6ebe79"
  },
  {
    "url": "assets/js/29.a4418904.js",
    "revision": "17f9fc9fd1b463aa41bc22496ce5562f"
  },
  {
    "url": "assets/js/3.82e21136.js",
    "revision": "f0b42982b36f76d361b8b3afd40305ed"
  },
  {
    "url": "assets/js/30.4ffae3e9.js",
    "revision": "0771ece1015ef037560401c90a529fc0"
  },
  {
    "url": "assets/js/31.9237c8c2.js",
    "revision": "ced81eaf26bfadb254eccf3be3a75313"
  },
  {
    "url": "assets/js/32.f20e6c1a.js",
    "revision": "d7a146026b3b2f721e14cf9d0d5ca0ef"
  },
  {
    "url": "assets/js/4.29e4a656.js",
    "revision": "53e9e972467a5bd39c8140950b7c420c"
  },
  {
    "url": "assets/js/5.7675f2d7.js",
    "revision": "b4ee5926a9a489291dd6be395440ba95"
  },
  {
    "url": "assets/js/6.cc4a4417.js",
    "revision": "3fef0cba7507f49d59c59dc93986c755"
  },
  {
    "url": "assets/js/7.389c4000.js",
    "revision": "ebf919a5aa1681225d0a901e54d8a185"
  },
  {
    "url": "assets/js/8.e06182d6.js",
    "revision": "dbbf601a7274e122b71844c6d68a8542"
  },
  {
    "url": "assets/js/9.cc3ec5d3.js",
    "revision": "89d9aaccfbbaf9b3c0752061f6e2c3db"
  },
  {
    "url": "assets/js/app.d3849665.js",
    "revision": "9eff500b6ce9fca6ee5df282fac107ad"
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
    "revision": "4dd08c883ff672628aebd241038ac877"
  },
  {
    "url": "guide/cli.html",
    "revision": "523cff7eb5f2fb16df131a77a56a99e6"
  },
  {
    "url": "guide/cluster.html",
    "revision": "de43536b03b7377eda5375c77efaac5a"
  },
  {
    "url": "guide/configuration.html",
    "revision": "5bece508b790a61be1ff4f95ad28faee"
  },
  {
    "url": "guide/entities.html",
    "revision": "b35ebbfcda78573ed45ffe2200be58bd"
  },
  {
    "url": "guide/index.html",
    "revision": "7d3135538e0c6a22835282d8e68cb081"
  },
  {
    "url": "guide/installation.html",
    "revision": "2f98efefb63c2a1d8f9eb092a4912a85"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "6ba7146d49c0e6787d41385d1c7a6a0a"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "ebb4cec9acee6e997685fdf600dea5a4"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "6feab432c3676cc9fd04d3ef073c36a8"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "260db3d0fc369f60363828762363d626"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "18e9ab7373e4b7c54f6dc21a00b6f62d"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "b1fe7b689d7616d8db620a0d9c443d57"
  },
  {
    "url": "index.html",
    "revision": "6aa6d5134436a869bb85f6e30abc8fa3"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "fa328068cd6f2e2e6765dc2b03d2b554"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "397835d936031537d62369961f169b44"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "943e6caf6a6b1679a296a5d4b4b35755"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "4f571a64c32b47040fac214383b0299a"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "1c81953ef4241ae0b853d7f4165b72ab"
  },
  {
    "url": "integrations/index.html",
    "revision": "13ce04ffed0f0a0c3f6982ae077ab63c"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "ddd5b646a05240c11205f4c2b307b307"
  },
  {
    "url": "integrations/shell.html",
    "revision": "b8555859319a49b7b1b2413734315568"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "931646aa7f5d4af4992ed9a91f23da28"
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
