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
    "revision": "0a7233784f132aa56292eb5722f53558"
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
    "url": "assets/js/10.baedaaf5.js",
    "revision": "c5b13c4e6d13e0d55abdf7ab864a367b"
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
    "url": "assets/js/14.6742055e.js",
    "revision": "0c4966b8bd91e1a40fe3928f8f04362e"
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
    "url": "assets/js/25.49eba394.js",
    "revision": "04986e2ccfa3712c1f73bd3b57dac63a"
  },
  {
    "url": "assets/js/26.82d7ad1f.js",
    "revision": "0c68306db0e0b2d4e9bece23fa7bb881"
  },
  {
    "url": "assets/js/27.4db23bb3.js",
    "revision": "43bad8413d93b54b95dfc45fa35859ef"
  },
  {
    "url": "assets/js/28.e52f3cef.js",
    "revision": "93c61586efee94c4e996cb29105ac17f"
  },
  {
    "url": "assets/js/29.68397bd6.js",
    "revision": "23847005641a706a6230e87cd0893302"
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
    "url": "assets/js/9.5f2d8d73.js",
    "revision": "ebbe02375aa14ddfb629754093763473"
  },
  {
    "url": "assets/js/app.0ddb3e1d.js",
    "revision": "6a40a3608adbed1bb0996c4a14322056"
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
    "revision": "2bcdf9608617195dbc07a8b1019576fa"
  },
  {
    "url": "guide/cli.html",
    "revision": "d1ebba01e3a3e35073db95c906bb8d05"
  },
  {
    "url": "guide/cluster.html",
    "revision": "900a1f24ecf77e34719e55edb81a15fe"
  },
  {
    "url": "guide/configuration.html",
    "revision": "050bf16acdda12ab302e94c82d9a9356"
  },
  {
    "url": "guide/entities.html",
    "revision": "02620b13d9df938c59c8bbc948d826b6"
  },
  {
    "url": "guide/index.html",
    "revision": "52f36af6cf663b8aa2eea69e1483357f"
  },
  {
    "url": "guide/installation.html",
    "revision": "7e2d6a3f2a01dd356f141c0fd37bb86d"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "05273e24fb548ab198898ce7c8359961"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "b8662878350baf6bd999cd660e3e3182"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "d5d0ba231a68115eca00fdb7e3147245"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "48ddbd6bcd2404d210bb583cd97f19b1"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "be83bfd001708fb80ff76368377a356f"
  },
  {
    "url": "index.html",
    "revision": "bb44fcf48367acfd64bafaa4fdf16451"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "5b5df14d8c6193169e68cd19e56d5d29"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "4376eb920c931e34f1a6937b33ab2a24"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "d58ad44b2fcdc567854e91ab3e83ee47"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "3f3ccf9f016a6a6d01a1f5e5c5dbd635"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "0efe17c4389b60f849c70993e04d112f"
  },
  {
    "url": "integrations/index.html",
    "revision": "4692e26fa4ee155b95a55081f231fe1d"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "ffef13d184e060ec9e3adb33f1f95744"
  },
  {
    "url": "integrations/shell.html",
    "revision": "8512a1c9fffd0190c6924d8dd320f9c1"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "e11bcd2af0d935aee7bccfd062863543"
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
