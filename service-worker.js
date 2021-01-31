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
    "revision": "2c86bbda459e8c090b15e08da707dd45"
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
    "url": "assets/js/11.b15b1b3e.js",
    "revision": "79a3f6fa3763ad1d8f649068b1c243c2"
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
    "url": "assets/js/25.7b9b5d3a.js",
    "revision": "7e593527544bc5aaedf29c2c4628f645"
  },
  {
    "url": "assets/js/26.706a25c8.js",
    "revision": "b8e879d72591aae03f7b558d440fa986"
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
    "url": "assets/js/app.d7c2bc65.js",
    "revision": "ef8c2b8947f1d903be4f6cf10deef96d"
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
    "revision": "2c8fd50b61ce3fb268e3a895fa5dce21"
  },
  {
    "url": "guide/cli.html",
    "revision": "18eecd4cba8452f346d8dbe525b2a9b9"
  },
  {
    "url": "guide/cluster.html",
    "revision": "1ec984422223d068e6d0840a3d26aacb"
  },
  {
    "url": "guide/configuration.html",
    "revision": "8aa4b2d38a22df0bbd28afbebe742546"
  },
  {
    "url": "guide/entities.html",
    "revision": "bc51005b5d5503147fa1ce9391616ce7"
  },
  {
    "url": "guide/index.html",
    "revision": "7877f1edb5c95a628529312bbfc9f206"
  },
  {
    "url": "guide/installation.html",
    "revision": "afe0599e0e65d6bf6f060a9cc2dd9b7a"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "5e009b02631dd48b21126b9b37f0c100"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "7b7ffc7e652ca30fb2df69975b3d34c7"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "8de02244fd8fdff98f7472347aa3a3ed"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "4e8f4baf581dd83fd82f5f1320cd00e0"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "3f4534258d15127932e1d1c962c23cbe"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "3233d5001b7961469008cb3663a93d50"
  },
  {
    "url": "index.html",
    "revision": "3d13714ab4b8abea237d40fa25548bfa"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "392b707c7e25d8f059b7860fde28c365"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "a3811ddb6efde76d45c15efb6aa49416"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "3204248c62c429cbb3b1a94465ddda81"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "459fe85e7e0b53921fcf150a7f7929b2"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "e66411a0b347042210329d62c55b0ce8"
  },
  {
    "url": "integrations/index.html",
    "revision": "f0af4892ae238ab223a9c3d25a9ad041"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "de3555e38ac412bd638f0a9fc9fd4513"
  },
  {
    "url": "integrations/shell.html",
    "revision": "078b0dd2843dd23a2c52955f5ec40a1b"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "dcbf674e05199f04cad5cc43c13dfb5f"
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
