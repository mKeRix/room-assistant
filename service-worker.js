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
    "revision": "1e723912c0f06950a23b4fbc559bd0e0"
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
    "url": "assets/js/26.e7970545.js",
    "revision": "e93a94c03adac68c28cdfb7d20e8face"
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
    "url": "assets/js/app.332e0501.js",
    "revision": "5b14d518164b15b9a8caa6a95a25a412"
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
    "revision": "6cfae6635612e922f1c4497b6985bf66"
  },
  {
    "url": "guide/cluster.html",
    "revision": "ac6bd466747d6492b07f186ad71a7b68"
  },
  {
    "url": "guide/configuration.html",
    "revision": "bc4079c65b7537ff6187e3dad91d63cd"
  },
  {
    "url": "guide/index.html",
    "revision": "bf3b0858af5ba9c71384a673ddc2ef78"
  },
  {
    "url": "guide/installation.html",
    "revision": "18835b6bfbaa26a0960b0379d57aca24"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "1db877ceda1af2a8db9523bc00cce711"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "1b5e5d882c6bb12f526b32fe8a3925ec"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "fb2d323fdc9fd4185d81273070bef1ef"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "7beffb5c887dc9a9ab31b03a3af13356"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "80cbea7cf9ae6d85e8b6a1f3378b477e"
  },
  {
    "url": "index.html",
    "revision": "4bcd480009ca68fc2b5b7e8c8573c977"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "b88bf3d4f2cfeb3383189998e8e21eb7"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "9a0179eae257166e6980e0c2157fe110"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "7446478756afc5d8b47a16bda8fc3bd1"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "8821ec8a8b6016d2aa2fdad0dba9a3e2"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "7632c912a5d2d8e8cf0e89ffc7e07cad"
  },
  {
    "url": "integrations/index.html",
    "revision": "6a0b0c13b8c9559e2ec5c844f8c91b2a"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "fcffe3b5f33245e7a759a1fc08eb8c89"
  },
  {
    "url": "integrations/shell.html",
    "revision": "1efc62c0a5092815fdaca7ade6c0c39e"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "46f993c409f80895837025089ac1cc63"
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
