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
    "revision": "f861186342b853c112c0ccc8ae0bb759"
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
    "url": "assets/js/25.7b9b5d3a.js",
    "revision": "7e593527544bc5aaedf29c2c4628f645"
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
    "url": "assets/js/app.92029e31.js",
    "revision": "78e44006ef791b3d68f8b6fc77152676"
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
    "revision": "5f281c2e273d40a7b0ef5e9bff3d9300"
  },
  {
    "url": "guide/cli.html",
    "revision": "27274379a3fc4daf016c5ea364a880ea"
  },
  {
    "url": "guide/cluster.html",
    "revision": "0bae10484c47f06a17510edfbbbc9216"
  },
  {
    "url": "guide/configuration.html",
    "revision": "7f345e5066bb881165aba18a6094547d"
  },
  {
    "url": "guide/entities.html",
    "revision": "8cfde9e7ecab4c5741eda9dfb2f3422e"
  },
  {
    "url": "guide/index.html",
    "revision": "862e3753ce3305312068b0a128f14e20"
  },
  {
    "url": "guide/installation.html",
    "revision": "3642aa9b64c5db7010f5dbe3872e9f79"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "b53af8c6f06bb65cce6d8b04b760ad97"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "583838c953d5d9f98d130fa46f658ad5"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "df7f01bc059cb683333422b47b3d7496"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "5831f94eb285e4c2f869b786f7dfcac2"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "7db1e8381591fcb7c2342f03496b7b26"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "f7d0793a8d2dfe7299fd4b5937688fc3"
  },
  {
    "url": "index.html",
    "revision": "003023ee51be349277531c1b85a8c708"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "712749658a1831d9f68ffa37d47c610a"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "e4cc3579ebdd0790ecacdb486fd1f62a"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "29169ea8d81f1914fc3dc60809d6ac7d"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "7d8659d4c897cf2a145edf07b4814196"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "8dc7c10862532a3cc7438de41ceb4519"
  },
  {
    "url": "integrations/index.html",
    "revision": "e1e29d998b62aece16e4bc7d0b6adf6f"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "76d61da6fb7b76f8caafff6e8bc40472"
  },
  {
    "url": "integrations/shell.html",
    "revision": "4f6e3ae2b4109c57fb310af7b7480912"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "9fd015e6fd2ca0d7547b42ebac8763fe"
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
