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
    "revision": "91d90599eb9199c87060fac70195e858"
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
    "url": "assets/js/15.9135cce4.js",
    "revision": "bf169bb32dec3b7ee8d17d9437ea53ca"
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
    "url": "assets/js/18.36162200.js",
    "revision": "2131995f86bebc5538596e7ce9e9081a"
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
    "url": "assets/js/26.d3a7088b.js",
    "revision": "69ac70c44538afe51b63cef58398b453"
  },
  {
    "url": "assets/js/27.5e2a3455.js",
    "revision": "7037670693c83d4591ef3111605e7091"
  },
  {
    "url": "assets/js/28.3e4f4db2.js",
    "revision": "039e8ff1cbc7f0007fb1cdec6cce8cbc"
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
    "url": "assets/js/5.c3d59034.js",
    "revision": "0ffe7a954c3a937b2e0e7ece726c9902"
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
    "url": "assets/js/app.8af0a71a.js",
    "revision": "3fd53c05e3e6ffe43fd6154b50f5a212"
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
    "revision": "5652caeb29c942b029f04110c7db3b26"
  },
  {
    "url": "guide/cluster.html",
    "revision": "7393a347ca2ed79149fa2f1c8ce82e02"
  },
  {
    "url": "guide/configuration.html",
    "revision": "4ec12db849c8526bf2303081e7c727be"
  },
  {
    "url": "guide/index.html",
    "revision": "55ee143e195ffacf0aeb4020a0e4ed94"
  },
  {
    "url": "guide/installation.html",
    "revision": "5291cc6d4e75b2465f4fa1353316d709"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "076cd3547e4c19f4d33916af768c1aa5"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "39a38c1631606e572a0d63d47560fbc5"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "6e5b6b0195bedf1bbaf4205689ef74a2"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "823f948a26c130371f0d525c85b215ec"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "cc06953f075065c6db59638d584ccfef"
  },
  {
    "url": "index.html",
    "revision": "5424787260842e49a3560780a2e0f7bd"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "d9ed2ea8d215c97d8d13d6bd58456bda"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "804555ea91fc2c6c92cb4c541811298b"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "452ae8856eb954b73bd4b05bf09624a8"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "8d2e91e9e378ee71dce356c3a6674159"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "c33a3d9c193118f6b3ad65f1237064d7"
  },
  {
    "url": "integrations/index.html",
    "revision": "e9932e4cef19e9f70c8521251c271992"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "449ea0f118016f1877e8ca1b2568a5d4"
  },
  {
    "url": "integrations/shell.html",
    "revision": "53706a8a501befb67baf8583db833fa8"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "4ed7406c8c46ee4324536e1a46d7ac3c"
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
