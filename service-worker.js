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
    "revision": "b27f0a94ad8f73ebc9000976113d165f"
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
    "url": "assets/js/app.bd953361.js",
    "revision": "0463e2ff73e8c5a4dd2d0db51428b948"
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
    "revision": "099387e4f797e019e8e7ffab223d8fb0"
  },
  {
    "url": "guide/cli.html",
    "revision": "889ef6bd10cffb2907fae467d0263cae"
  },
  {
    "url": "guide/cluster.html",
    "revision": "a44cada744c2d44280dd1848928e2e8c"
  },
  {
    "url": "guide/configuration.html",
    "revision": "7ca43231c1208f2b896906415577f62a"
  },
  {
    "url": "guide/entities.html",
    "revision": "da24d0d61b4305c852346089d2995560"
  },
  {
    "url": "guide/index.html",
    "revision": "59e8ff047855aedbb10014b928849386"
  },
  {
    "url": "guide/installation.html",
    "revision": "587b074a10e81d9e288b9ca1fc203ce5"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "0f1ce1cdd40cf7afc07a7109c9ffee7c"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "3ff07dab23aac0ff7cb639612f99f447"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "02ceef772b9a0fafa9777b903dc9b95d"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "2118d1622908bb90a04cc6c0d1be20eb"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "fe6dc20af7a6fb9551fdfb1ad9c390ca"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "940bc5b7414d6fdbda63160550fefce7"
  },
  {
    "url": "index.html",
    "revision": "55c8d06c950c0ad384adbc696bf5aa58"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "94ded5373d4cdc8640696526e5299fce"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "6f298f2028536d029b72347dd3a5b2ca"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "768b39d290aeee6d5833def6a935cf64"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "cc51de1c3ff4d11794aebeeb0166e146"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "de0c736d43af46491f009a1be6f4013f"
  },
  {
    "url": "integrations/index.html",
    "revision": "71f2ab8bc13c1a69f6a806164224d489"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "363bb100dcc7ddb53eb29fefca5b913c"
  },
  {
    "url": "integrations/shell.html",
    "revision": "627324334d141fef3f8d737fa6ddc64a"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "a869e5095c18dd04ef7d59ef6ad39554"
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
