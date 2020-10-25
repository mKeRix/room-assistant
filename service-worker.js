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
    "revision": "a305576c51cab2bd1c9fca6cc9e27635"
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
    "url": "assets/css/0.styles.e14b71af.css",
    "revision": "7793e532a09e1ec35d8d32707414935f"
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
    "url": "assets/js/10.4562fb7e.js",
    "revision": "62b7892be4c9c084a3967c5f781f7266"
  },
  {
    "url": "assets/js/11.d780b099.js",
    "revision": "a39155e0ae3bbad57e7e8a066523873b"
  },
  {
    "url": "assets/js/12.cf988ccc.js",
    "revision": "0c6b89e2c592c710c3ab02bd490388f3"
  },
  {
    "url": "assets/js/13.1317a147.js",
    "revision": "650af5179864fcc7ebf7ff14e9ca7b87"
  },
  {
    "url": "assets/js/14.998a6706.js",
    "revision": "689259e2e04333b779cd70eda7c8bb89"
  },
  {
    "url": "assets/js/15.3c8b0d26.js",
    "revision": "7b28a8b8bda3a3be028ee8a914d2a05b"
  },
  {
    "url": "assets/js/16.8fd38184.js",
    "revision": "f718c21231c802ef273363cdae835aa5"
  },
  {
    "url": "assets/js/17.f9fb2265.js",
    "revision": "9553edfd14f9e6bbe87bc1c83b4fa257"
  },
  {
    "url": "assets/js/18.c10613c9.js",
    "revision": "f21e9e8a2cec2ebf5e0730d68e57a239"
  },
  {
    "url": "assets/js/19.b4825a2a.js",
    "revision": "72d3af8a582a799d10a372bf9de236ca"
  },
  {
    "url": "assets/js/20.9e58e2d0.js",
    "revision": "d9b0e2a1fc4b6e24a22cec6062c02e62"
  },
  {
    "url": "assets/js/21.9850b2d0.js",
    "revision": "88f1a1098148cb39df49f7b90ae050d6"
  },
  {
    "url": "assets/js/22.bf456285.js",
    "revision": "ab6437671156fde840cd22011a90871c"
  },
  {
    "url": "assets/js/23.023bfca2.js",
    "revision": "1ec2d3afc31c92773b06c9ace9dd2e74"
  },
  {
    "url": "assets/js/24.fbcaf382.js",
    "revision": "a755be86ea4b2caccbe46fe1f901e0b3"
  },
  {
    "url": "assets/js/25.93f1a1b1.js",
    "revision": "842647d41232c1edf426d6f0ceddff43"
  },
  {
    "url": "assets/js/26.82d7ad1f.js",
    "revision": "0c68306db0e0b2d4e9bece23fa7bb881"
  },
  {
    "url": "assets/js/27.dd5af51f.js",
    "revision": "dba06e6176aa3dce9c70b86839b4e7b1"
  },
  {
    "url": "assets/js/28.e52f3cef.js",
    "revision": "93c61586efee94c4e996cb29105ac17f"
  },
  {
    "url": "assets/js/29.b7ff3701.js",
    "revision": "ec6e3b7fca17742d7df963cad0b593ef"
  },
  {
    "url": "assets/js/3.367000cc.js",
    "revision": "ffd1af3139ca7f2b3520f1d4041e4afc"
  },
  {
    "url": "assets/js/30.b43b221d.js",
    "revision": "4e47be67d359b0daac66cc3cb962615e"
  },
  {
    "url": "assets/js/31.924c9976.js",
    "revision": "2df84c55c8b1f079728f48fde7d5c4d0"
  },
  {
    "url": "assets/js/4.3c3d31fc.js",
    "revision": "55bd879487185f9ae2cfb3c78ce3a0ef"
  },
  {
    "url": "assets/js/5.00605157.js",
    "revision": "4c02d6da760be805b1dda09e1b3b8025"
  },
  {
    "url": "assets/js/6.2529d299.js",
    "revision": "4c98e74609398306e529b783b47c5664"
  },
  {
    "url": "assets/js/7.4b39e7f1.js",
    "revision": "0d9fbce042cac068f943576aedf2fbed"
  },
  {
    "url": "assets/js/8.8bd7e8ce.js",
    "revision": "dcbf7ffd55b36f53ba3f41c4c8ebf65b"
  },
  {
    "url": "assets/js/9.38373d46.js",
    "revision": "c31a29fa0c18cc30806643cfbe471dff"
  },
  {
    "url": "assets/js/app.93655539.js",
    "revision": "cd892f64892c6ff22e0b1d0237dfea3c"
  },
  {
    "url": "assets/js/vendors~docsearch.c67f3c8d.js",
    "revision": "8e6987e7c41a0d9288783279ffd0dfde"
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
    "revision": "118ddc2956591bca517aa99e0055bd2f"
  },
  {
    "url": "guide/cli.html",
    "revision": "fe0efa2a83803e5083df1089b746db25"
  },
  {
    "url": "guide/cluster.html",
    "revision": "3e205d3b39557c91f4029ac0d05a8e01"
  },
  {
    "url": "guide/configuration.html",
    "revision": "5df720e8cbf3ea62b65c3571878bbe29"
  },
  {
    "url": "guide/entities.html",
    "revision": "8da19c8de031aa9b074d9ab4d8ac9ea5"
  },
  {
    "url": "guide/index.html",
    "revision": "ca3323dfc93d712627e4eb3bfaa7a911"
  },
  {
    "url": "guide/installation.html",
    "revision": "4812ea5e3f86e90fecaf1e4731ebc8ef"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "c36528a86fb0b4a59eb1eaf2043970cc"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "d1f560cb7455bcf687ac1a07330fbdd8"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "9faaaae7d9827ec11eadc4e3af4b5293"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "641e068499a43c4faa8c8de505fb975d"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "7535b48ccb9bc185beb7652f2d12cee5"
  },
  {
    "url": "index.html",
    "revision": "4e89984a056a254eca315786c2666cc0"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "5adfcae7c1c57f89415d369e10b5ef15"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "5e7270f2aa81e8227bec37e3983a3c9d"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "0b5da4adf80c374e604e2b1fd4d3f471"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "e442a39a4ae9579e20ed2f8dafa30f5a"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "c71ef82462bda9744927f10f9b5150ee"
  },
  {
    "url": "integrations/index.html",
    "revision": "945363bd62ece8d8d7e8b7fd5d24ae28"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "93d9f45dfb1a13dea458a3b1641a3458"
  },
  {
    "url": "integrations/shell.html",
    "revision": "4d76e8b272aaaadc0c896200f320b784"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "3011906407ba919ca4d61414c6450a05"
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
