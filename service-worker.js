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
    "revision": "b4658a58f02b0463d90e380cf5ed2258"
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
    "url": "assets/js/14.0e089798.js",
    "revision": "c4e7041fd6275dc60623af1d92a672d0"
  },
  {
    "url": "assets/js/15.b1e688dd.js",
    "revision": "0f820a87cc05ef85ebdaff0016196505"
  },
  {
    "url": "assets/js/16.738cb09c.js",
    "revision": "c554a7ede0189d4bd432100f6dcfb989"
  },
  {
    "url": "assets/js/17.ca11fb92.js",
    "revision": "8db03fd8ec87148481e19397975ffdee"
  },
  {
    "url": "assets/js/18.bf714d79.js",
    "revision": "57e7e261c3727479a22d380f67888fa4"
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
    "url": "assets/js/8.8f8950de.js",
    "revision": "c0f26448ac743f3d3c65965e8c34e1dc"
  },
  {
    "url": "assets/js/9.2901fc53.js",
    "revision": "52ef4deed330d3f59a6a53710038e121"
  },
  {
    "url": "assets/js/app.f1554b98.js",
    "revision": "5507a48216d8d37a44432135539e8f17"
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
    "revision": "25183b2cde04a544e336aeb9cd21c7d9"
  },
  {
    "url": "guide/cli.html",
    "revision": "3b73d477f010d1ce25b9b95c1d7cb3f0"
  },
  {
    "url": "guide/cluster.html",
    "revision": "f016595c65997f15ccdd16b9d32d9165"
  },
  {
    "url": "guide/configuration.html",
    "revision": "63204e5eaaa972d8ff3b7d72784c190e"
  },
  {
    "url": "guide/entities.html",
    "revision": "3b3be7c598eff957ce13db738b62e222"
  },
  {
    "url": "guide/index.html",
    "revision": "e55a37b19336284e2f9a1d6f4b609379"
  },
  {
    "url": "guide/installation.html",
    "revision": "08b4c74b17d2ccb63c860ba93586524b"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "2da376e1191a3964ef7f734ff80b1831"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "eedb5221b655b49d86550d5d864231e2"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "a5bd88580d997d8f42fc8fd22b755eda"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "39cd4196711ae47a6418fe4a80fc3c9c"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "115436a83d9d73247412dd262a15bf94"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "e765632ca2ec3d71574431f020266b12"
  },
  {
    "url": "index.html",
    "revision": "ea5b7ae2873378ed19bf2b37052c6140"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "6140a74b2b95b9d7fa346b2ad07ae745"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "e32fad23e31a52b481de32ab785fba9a"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "49edfbec444a245638130231645519f9"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "20865ca6ac71921198af53331f007860"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "13c8200b8e58ff6a23a54ad77244f0f6"
  },
  {
    "url": "integrations/index.html",
    "revision": "e96e42fb97343b539c6f49cfa83c1cfd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "b295dac50161859d03e0d089c622edb5"
  },
  {
    "url": "integrations/shell.html",
    "revision": "4ab182623efbdf4bc660ea92af07dfe5"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "5b4473d0b68e8cf21b48a55c4fbb8fee"
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
