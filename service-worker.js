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
    "revision": "aa8fb17131d8d6e674e7498db94d9eb5"
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
    "url": "assets/js/app.b90ce9db.js",
    "revision": "1131bc99cb16272b21fe531e78a0cbf3"
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
    "revision": "33e63a08dab5257999f36de6e4e63e44"
  },
  {
    "url": "guide/cluster.html",
    "revision": "b60f30de0dbfcd7e44fbea41b87361ef"
  },
  {
    "url": "guide/configuration.html",
    "revision": "3a13af2016fc3da48c5fa9b78736803e"
  },
  {
    "url": "guide/index.html",
    "revision": "02c6a7a0e69051507509bd0d06842ebb"
  },
  {
    "url": "guide/installation.html",
    "revision": "d5c48b2b593e17fae0535bea3f957db3"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "ee06fb1961fc3b135cf3d21285ddd10f"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "0668b93959418dde6277276a0736971e"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "f591d3ec4c8922e9323952b8aeed0feb"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "776626bfa691c08ed889c7ccd3e0cf19"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "3036fb26d87a0a88d9f4726e4b019cf5"
  },
  {
    "url": "index.html",
    "revision": "61d77c97fec08f7881d42a3fa4c5c997"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "e38872457beaa1d49cddb7e30a6c79df"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "85cc5fcc9aac7db27f15cad0f2aed632"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "32ca7e4e1ee4054758c722ecf74b686b"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "01d673e37d977760894d6acaa390062d"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "8dc3dd838865850b15417fb7e269797a"
  },
  {
    "url": "integrations/index.html",
    "revision": "53df440fdfa0343bc0361a253bf806c4"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "21949bb60e4daf72cb8bc9c1606247d6"
  },
  {
    "url": "integrations/shell.html",
    "revision": "683f6ce95d64e19af370b978d93a7607"
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
