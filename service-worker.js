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
    "revision": "3a26b5185c533ce870509373d9ff5bf1"
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
    "url": "assets/js/16.5800673e.js",
    "revision": "517675c10a374ffd6eeadaec39b2b601"
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
    "url": "assets/js/19.82b034f3.js",
    "revision": "49db363a147322fa5c8b89bdc3b645b0"
  },
  {
    "url": "assets/js/20.9a2787d3.js",
    "revision": "ab1d959501193456de47f6a23b5babad"
  },
  {
    "url": "assets/js/21.35353ee6.js",
    "revision": "7ec3616189abcf4f619c6238dbd02098"
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
    "url": "assets/js/25.16cd15e0.js",
    "revision": "ed2aa99198f2ba019b01dcffc82504c6"
  },
  {
    "url": "assets/js/26.5c68b13d.js",
    "revision": "3351031c6763a27acc8e4942e616d232"
  },
  {
    "url": "assets/js/27.7fa4e0ed.js",
    "revision": "21d8b21aa565158cb272da8a8877985e"
  },
  {
    "url": "assets/js/28.23ea89ab.js",
    "revision": "89ddcdec8309e6d7b0605931ea91304e"
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
    "url": "assets/js/8.f53d9c3a.js",
    "revision": "e5324bc5d62ffff227f56a1d9b54ca73"
  },
  {
    "url": "assets/js/9.2901fc53.js",
    "revision": "52ef4deed330d3f59a6a53710038e121"
  },
  {
    "url": "assets/js/app.de46d666.js",
    "revision": "339ba36ad83bc36fca32eaff92a8f6b2"
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
    "revision": "030607558508db4256ac113359802580"
  },
  {
    "url": "guide/cli.html",
    "revision": "c82c8690e3f926c2c3a465299107ab30"
  },
  {
    "url": "guide/cluster.html",
    "revision": "2acb2cd3167c9f6438e65a4e333997ce"
  },
  {
    "url": "guide/configuration.html",
    "revision": "1fb302c5abf80b6769ac7b5bb272282b"
  },
  {
    "url": "guide/entities.html",
    "revision": "64ade83ef4298db8bbfa6ba34e18bb0f"
  },
  {
    "url": "guide/index.html",
    "revision": "a668428ac92a85fa350f5eb1fa7ed188"
  },
  {
    "url": "guide/installation.html",
    "revision": "51b2567858219ce31b8440681dd488d9"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "7473ce9fdd504ec05a37fc81332df7fb"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "1752d3db6cfb4852eadea04bce57a2bf"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "a7f51ce2d645b67d32c6c91ba1ab875e"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "fc6ba73ae6a80b5ad48cf5fa61c1abc6"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "7f7c72c5eb9242790645d74667f64d36"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "586107d2f9ea61fcaf9566f34784509a"
  },
  {
    "url": "index.html",
    "revision": "7059f7836673e408d96a492d18ed96f5"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "fc543b237ef729a675662c6456185690"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "c2a4b1dff39e5e484930ca93a8c7ffd3"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "6c75e76f7e7f3cf0e3582b78458d3bde"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "deeb0ad173e8cab5e8004dc11c4905b2"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "07664501e9b816b3b23dca984677b96e"
  },
  {
    "url": "integrations/index.html",
    "revision": "ac9385bf903b6e77b566cde6049519b4"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "534e4f4a6b28b6b54a5bac1a5593e697"
  },
  {
    "url": "integrations/shell.html",
    "revision": "9c494901b318e6b535d18066f5f248bb"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "6740ad437085e1e5e23282645f965eb2"
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
