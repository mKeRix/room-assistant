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
    "revision": "17ef5725079eddb572715829616f51b6"
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
    "url": "assets/css/0.styles.0a63d30b.css",
    "revision": "2aec67271adaa51d507a2ea225341b0e"
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
    "url": "assets/js/10.492d37bf.js",
    "revision": "51ccdc2cfe0ac84863f059fcaddebe4b"
  },
  {
    "url": "assets/js/11.89199661.js",
    "revision": "9d3e4a22045b6ba9b53347b27eb29159"
  },
  {
    "url": "assets/js/12.200bc99d.js",
    "revision": "a3bca053da954e10a01659abfa3d9c37"
  },
  {
    "url": "assets/js/13.acf02124.js",
    "revision": "2ff2781fa3c422de9e64a952ec3b2af5"
  },
  {
    "url": "assets/js/14.ced183ca.js",
    "revision": "fab462dae322af57e1a1c5288c61d966"
  },
  {
    "url": "assets/js/15.e7cb0604.js",
    "revision": "5062dd66d4082d93d639195b9bd2a475"
  },
  {
    "url": "assets/js/16.431bdeff.js",
    "revision": "3bbcc85c94502f601aeaa9f2dd0ea6e1"
  },
  {
    "url": "assets/js/17.5c00a3cc.js",
    "revision": "76dd95e112be56757e1840043286fe76"
  },
  {
    "url": "assets/js/18.1d08c055.js",
    "revision": "430afeb3056ca0fd61c8a2b5a66d0132"
  },
  {
    "url": "assets/js/19.765763ef.js",
    "revision": "5ae12b3273955ef4bc86f49da5de713c"
  },
  {
    "url": "assets/js/20.ec3cc643.js",
    "revision": "075b017cb3e631579de309c9b8c07f14"
  },
  {
    "url": "assets/js/21.96a99744.js",
    "revision": "908dbfc257d790e140bcd5749431f681"
  },
  {
    "url": "assets/js/22.938c1965.js",
    "revision": "a58c49a50a250acce442af4cd4d364a0"
  },
  {
    "url": "assets/js/23.98292e44.js",
    "revision": "50ddf5e6ce1aaea8faf978b8697cd62e"
  },
  {
    "url": "assets/js/24.46adee54.js",
    "revision": "f19e9de11f05406d6cbec84ae3f97f2c"
  },
  {
    "url": "assets/js/25.6a3e6daf.js",
    "revision": "aa036c03e76f98cad86dfa7f75a830f5"
  },
  {
    "url": "assets/js/3.50b3844a.js",
    "revision": "75ad4c7049dcee2f73c3894b0f81fe2a"
  },
  {
    "url": "assets/js/4.8413a8e7.js",
    "revision": "5771909da8d4920aad42e2cf8d9651c9"
  },
  {
    "url": "assets/js/5.13a65f50.js",
    "revision": "b80016207bb2edb49c77b53e4a5a57a5"
  },
  {
    "url": "assets/js/6.df8adaa0.js",
    "revision": "fb3d1c448f991526289c92a570bfc3f9"
  },
  {
    "url": "assets/js/7.b7e0a8e9.js",
    "revision": "20420eab39202666dbe154383c0e3b4c"
  },
  {
    "url": "assets/js/8.5825444f.js",
    "revision": "82b88323fbc32a6f7cbeca97d9d93398"
  },
  {
    "url": "assets/js/9.82cd48bb.js",
    "revision": "7119246f29e6182a99fcab4b261bc1f2"
  },
  {
    "url": "assets/js/app.c0ce7efb.js",
    "revision": "f71f142332eb8ce16ed5e2f17214e877"
  },
  {
    "url": "assets/js/vendors~docsearch.4a1fb7f1.js",
    "revision": "54580ebeb592c92ef9d25716497bf914"
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
    "revision": "75b68fc561dd65f4cf10776c2eb48f9f"
  },
  {
    "url": "guide/cluster.html",
    "revision": "c5b3cdeb89e78eb7136c18c66b661f78"
  },
  {
    "url": "guide/configuration.html",
    "revision": "68bebf27bdbf79d1680330dad1f44631"
  },
  {
    "url": "guide/index.html",
    "revision": "10264f513a5b627ea010ba1aced99a5a"
  },
  {
    "url": "guide/installation.html",
    "revision": "3584c36821a26a4e84b704bd97e4d4cd"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "7be0bd5e1d0056bd6156831f909cb48e"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "57cd31c7a6f05f3e2e86dd042a48bfb5"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "eb2956e347420829812e242bc27ec2a1"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "b2f125b52ca14940ace8d10e510d373a"
  },
  {
    "url": "index.html",
    "revision": "ca79ea7436de52f3844076931eacbfb0"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "88c89077988cb3f866eb7e2ef7307f0f"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "045a848473a9eb9e1333758aa97bb981"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "28bdeb85350aecc479e1546fae219de2"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "d75521a2be5d13aa7ab90807e9499764"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "c0b4e9fb35396e89928478afdc5294a6"
  },
  {
    "url": "integrations/index.html",
    "revision": "672e89c511b036b140f12ea72aa4eb6e"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "368c18cd55abe623597b4bc4c430f56e"
  },
  {
    "url": "integrations/shell.html",
    "revision": "30be69f1ba78ece88c281397fb7b69ac"
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
