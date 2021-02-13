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
    "revision": "ddbcdf3ce03c364416a6ff644c6f2cb6"
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
    "url": "assets/js/11.ad24640a.js",
    "revision": "e4d0c04534cd53b434042cdab952a37a"
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
    "url": "assets/js/28.abb4e1e8.js",
    "revision": "43d6aa377f6f73efb3912716bc9cfa06"
  },
  {
    "url": "assets/js/29.c051e3e9.js",
    "revision": "16cc022a129069c8049f6c3f08db22d0"
  },
  {
    "url": "assets/js/3.82e21136.js",
    "revision": "f0b42982b36f76d361b8b3afd40305ed"
  },
  {
    "url": "assets/js/30.73ec038d.js",
    "revision": "bc1223400394544cfb06dfa03776d54e"
  },
  {
    "url": "assets/js/31.78a5dfde.js",
    "revision": "261e7aaca5358889f6599311e9c006bd"
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
    "url": "assets/js/8.b4937367.js",
    "revision": "933d346e20c21b85a6e82a5b14d9e9f3"
  },
  {
    "url": "assets/js/9.cc3ec5d3.js",
    "revision": "89d9aaccfbbaf9b3c0752061f6e2c3db"
  },
  {
    "url": "assets/js/app.af217376.js",
    "revision": "40c39f09550cad41776e6a7699392422"
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
    "revision": "fc6e8181abba652204d70839d44d21f1"
  },
  {
    "url": "guide/cli.html",
    "revision": "f26fc6d89f3b141becd6252684717078"
  },
  {
    "url": "guide/cluster.html",
    "revision": "3cc8a3fb4e67ed7ed5f47dd0fdab3d22"
  },
  {
    "url": "guide/configuration.html",
    "revision": "26a4b15e0cbe3a080f07b937145baa0a"
  },
  {
    "url": "guide/entities.html",
    "revision": "1e0a7f4e3d7740c5c5ca2cbd4334ac0c"
  },
  {
    "url": "guide/index.html",
    "revision": "5f77d31f7848a77b0ce62ca8fe5bc7cb"
  },
  {
    "url": "guide/installation.html",
    "revision": "c4def57c773d18928b42ca4616dea016"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "c668ebbe967295409e1fc615fc26656d"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "4b67fdfc23c236919883250bda5693ab"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "5758bc2f842ee19609011b80f7fc4b6e"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "23974e045d5071aa23373f7d57be0446"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "d758700fb29764e6e892c3c3a562c1a9"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "26fb261309b0772e545c7dd9e8673c91"
  },
  {
    "url": "index.html",
    "revision": "bfeab1e3f15783e758a380cd6e38a95c"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "f77c03eabbf9a07b75ef6fa99d6d7163"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "9753c46446d7c5cd3631d169bb97220d"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "0dc05dbc1a024f834fb33a2654bfca64"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "a6b2d28724a5869c0be87efafe69271b"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "2c3b65bbbbbcce25d7dc60b3c60a4f53"
  },
  {
    "url": "integrations/index.html",
    "revision": "3f4b0f2e762d6af58a7bcd22b3232581"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "44a8760ce02a322f99099a6756c9594c"
  },
  {
    "url": "integrations/shell.html",
    "revision": "5cd1dbe13b50786d0adbed7810a19858"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "d1220bca52515b829afd71b3c36a7cea"
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
