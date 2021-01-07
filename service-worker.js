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
    "revision": "4b6848b3efdb8840d5ba5f02b981e944"
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
    "url": "assets/js/14.3fa8378d.js",
    "revision": "cf347740520da19dc8838388ede0820e"
  },
  {
    "url": "assets/js/15.a8a6aa61.js",
    "revision": "99510684064eeb39c7eb68d29fe80735"
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
    "url": "assets/js/19.061fa3a6.js",
    "revision": "4d7f963cee1b10d1e63c2a1215c4fccb"
  },
  {
    "url": "assets/js/20.183bf4bc.js",
    "revision": "72c2e0d2827767edd352464f21780b39"
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
    "url": "assets/js/8.f7a43587.js",
    "revision": "517751f033942ee6728a2b17facccbf5"
  },
  {
    "url": "assets/js/9.21b760f5.js",
    "revision": "d3125a61d8fc598f51638b19536341c9"
  },
  {
    "url": "assets/js/app.28513827.js",
    "revision": "31cbe49409ecc962f357ee67613ac4a0"
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
    "revision": "e90a5c2c6f0d9d404c46eaf9b98baede"
  },
  {
    "url": "guide/cli.html",
    "revision": "964d614a04565b4fdf0a2ca29b1838cb"
  },
  {
    "url": "guide/cluster.html",
    "revision": "124165a03860a39d0637de422cf7e126"
  },
  {
    "url": "guide/configuration.html",
    "revision": "a31c7502ba454d96add0bf5afecc5b5a"
  },
  {
    "url": "guide/entities.html",
    "revision": "4f4f9285901895181f3a70e92c0ed761"
  },
  {
    "url": "guide/index.html",
    "revision": "e96eb3ab27347ce33f9539ed9de0a24c"
  },
  {
    "url": "guide/installation.html",
    "revision": "7355509b86498e643844d4f61e38f18b"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "569b4bcd44b95dd7f39f39806b4ef686"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "5a075a4f6900328d5c3aca79af4d4d17"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "dda5cf6d51d6425e5ce28253e3a3d40f"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "749d55ae5094f3327213af9f52bcbecb"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "b89de5f546fd0dc02006aa8cefa02c75"
  },
  {
    "url": "index.html",
    "revision": "18cbdc63360067651ac1ed104131a179"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "8cb866dfc7b67e6d06e23c54f8a980de"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "b67675593afbca8cd8ccc2d8c85034e2"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "002628b92f918aec31ff5e7121d39c99"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "4757016748396f06ab2e4013ece02548"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "aca8309f72ce54ac13fc6bdde4ccfef9"
  },
  {
    "url": "integrations/index.html",
    "revision": "235767b0a277fd773e8733f4fda6c274"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "5ec767aaed37e2cd5b69206c6e72dadf"
  },
  {
    "url": "integrations/shell.html",
    "revision": "d28fd34fba7f8894cb3520db3525aec2"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "9a1d8bd2eb4ba71d6d69c3294bb89a16"
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
