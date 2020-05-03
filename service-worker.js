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
    "revision": "a0e78dda3b2dec42cab9bdbad88cbf0a"
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
    "url": "assets/css/0.styles.c842ffc0.css",
    "revision": "ade25923bc2c15cee0d82d403d581f4f"
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
    "url": "assets/js/10.5f667082.js",
    "revision": "391d7c4ee16819165c0414bfa6b76c1e"
  },
  {
    "url": "assets/js/11.77da6218.js",
    "revision": "4894e35afec1b1f693f32f8ce0fedfaf"
  },
  {
    "url": "assets/js/12.57f2921f.js",
    "revision": "8c407a93c3efff813f1b6f815cab3974"
  },
  {
    "url": "assets/js/13.bbe7879e.js",
    "revision": "f4df058f8885c64c05952b428433e8eb"
  },
  {
    "url": "assets/js/14.6c94ee5f.js",
    "revision": "22d10d6eb5a14763151731d39a49e497"
  },
  {
    "url": "assets/js/15.c15d8df1.js",
    "revision": "ed825a339bb919cf3b42e5d292f6e93a"
  },
  {
    "url": "assets/js/16.2b8635ec.js",
    "revision": "0e719338223c6b0717e5a2a4ab410fa0"
  },
  {
    "url": "assets/js/17.533f5ce3.js",
    "revision": "6350efd4a09eadb854d8954d8e9c3c50"
  },
  {
    "url": "assets/js/18.ff1a04a5.js",
    "revision": "6a4d786359f0266ad52f34a76d183a1e"
  },
  {
    "url": "assets/js/19.05b35cf7.js",
    "revision": "a3333d95508fa3925612407014f496de"
  },
  {
    "url": "assets/js/20.2afa5d98.js",
    "revision": "54866a280b0df0f36b205fdc901ce3d2"
  },
  {
    "url": "assets/js/21.262b9b62.js",
    "revision": "4b6236e1ff323021194130050e68b738"
  },
  {
    "url": "assets/js/22.9577db3c.js",
    "revision": "1f607b6d1ddf48ac1d2317b960924dc3"
  },
  {
    "url": "assets/js/23.4e00b066.js",
    "revision": "ee09713ea04d74c254e07590998cea67"
  },
  {
    "url": "assets/js/24.99834349.js",
    "revision": "e0927a21e4f3fac5a02c63878feb0ffa"
  },
  {
    "url": "assets/js/25.44936f9e.js",
    "revision": "4a1f0ade7d9bbd5d75a537d3f09cfe5f"
  },
  {
    "url": "assets/js/26.7248b4da.js",
    "revision": "ff0416dda22766909c3ebce556b79a52"
  },
  {
    "url": "assets/js/27.3e65b546.js",
    "revision": "ef75f0cfba33ef8b1f4f5786d98eab18"
  },
  {
    "url": "assets/js/3.6df687a1.js",
    "revision": "19cbbed21ab64f7e02df8dfab9fb6732"
  },
  {
    "url": "assets/js/4.210fbc73.js",
    "revision": "3890626ff1e75edd478342a916742246"
  },
  {
    "url": "assets/js/5.3de7faec.js",
    "revision": "44ebfd00672914a19ccf9d515ad8f855"
  },
  {
    "url": "assets/js/6.4cce88b8.js",
    "revision": "08c64eda85051171e927be6c4d74bdf0"
  },
  {
    "url": "assets/js/7.89c785f3.js",
    "revision": "ebc7d44c910fbf55cc0bced17da157ee"
  },
  {
    "url": "assets/js/8.642d3181.js",
    "revision": "bd608bf762aedce44b88558db5219853"
  },
  {
    "url": "assets/js/9.25584f20.js",
    "revision": "5543157c713ac15c843327efdea5d91b"
  },
  {
    "url": "assets/js/app.b8f002e9.js",
    "revision": "83704f7065434a3294298b67d0310b98"
  },
  {
    "url": "assets/js/vendors~docsearch.a442d7e7.js",
    "revision": "6ce6620afe9b6adf1c437ed91a13a1e3"
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
    "revision": "a0a6f59e86bb89d49adbcf6f658e9ffb"
  },
  {
    "url": "guide/cluster.html",
    "revision": "6db1039a9943ad9e4a3ddc7bc2976247"
  },
  {
    "url": "guide/configuration.html",
    "revision": "6fa4e2de0336c2cb059d1b15de56357f"
  },
  {
    "url": "guide/index.html",
    "revision": "72d67ae69a509dc98e633814ccfb2b3b"
  },
  {
    "url": "guide/installation.html",
    "revision": "8798ab5ff148b5bcf45f732f63fbd643"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "31928af7449fea4adfb0a65b331e1fd6"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "1930f339325a3a20d994777c63c631c1"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "d3db7b6addaebbcb4872b46ad3c5af97"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "5cdda003c04bc771c01417e3fe6f3be2"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "215bce77e604c79eb3a62e44422ad1d8"
  },
  {
    "url": "index.html",
    "revision": "b009a6946dd14d6f1cc7fe69969f7daa"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "43825ff69633701f73b22cba36e2a5db"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "db507cbe33afc4ce213756da4418827e"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "33c400271f49b8d8ffa3ad057e49765c"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "d3aac985daef330efbb73f4a54f8aaee"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "1f1d18ac3ca8534ad8f360f97586df97"
  },
  {
    "url": "integrations/index.html",
    "revision": "ad76fe0a84d0c1f264fab5d37e41fbbd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "5e8f61be32ab638c23b435bf65a004a2"
  },
  {
    "url": "integrations/shell.html",
    "revision": "c8c7d393c3a38f751f3a6cd5f3728271"
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
