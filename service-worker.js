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
    "revision": "97736d329858a1fc4b6fd562745b115b"
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
    "url": "assets/js/15.4e9c502f.js",
    "revision": "2df0ffab8354245c41765dee1f89208e"
  },
  {
    "url": "assets/js/16.e2f62660.js",
    "revision": "6ebf87b174ba99daa53f9f943bb5e43f"
  },
  {
    "url": "assets/js/17.35bc97e7.js",
    "revision": "7c3dbab4c8e8f03fc925506eb4e2ef54"
  },
  {
    "url": "assets/js/18.8679d344.js",
    "revision": "1fc0cdcd6ab94e3b30194cf790a1a3f5"
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
    "url": "assets/js/28.6a8f0473.js",
    "revision": "f0c5d95a6de63b86215eb46203bd5c69"
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
    "url": "assets/js/app.0228ef2b.js",
    "revision": "d28dc4fa22df8a552109de13381b5705"
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
    "revision": "c2e85200ed065791f847197fe3b8f801"
  },
  {
    "url": "guide/cli.html",
    "revision": "80340a870f53e17d66b8baed28b26d9d"
  },
  {
    "url": "guide/cluster.html",
    "revision": "ddd207c90ce148d2a87ea8979314fe10"
  },
  {
    "url": "guide/configuration.html",
    "revision": "93ac39e86bd4af7a77af6a47e7b0697a"
  },
  {
    "url": "guide/entities.html",
    "revision": "5627c0c5d394863acbe8a53ed48c0c68"
  },
  {
    "url": "guide/index.html",
    "revision": "15585378c51f11bde817bafba925134d"
  },
  {
    "url": "guide/installation.html",
    "revision": "452bbdfbe77fa5f26c2095d20631955e"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "16098889b7cb44b2122e72aba6db56d0"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "d75df969048abf4facf84cb738e56e4a"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "a34b1e4b0412fa85c91b4ec0d24b8f3d"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "f57874cb169752a04cace5ed1ebe2772"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "036982dd29e258cf689ad5a668f97715"
  },
  {
    "url": "index.html",
    "revision": "c7261b332cd1364d90805e8620d5ca82"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "a3cb5728325d2020acad53f5bf349b2f"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "50d25a8fa467cf88a57429d8ab787a54"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "569b82f4e28625be1f0def41862c9f8f"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "37970201cc2032a5ff92f96910f4bd78"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "4b979f405cd7b202356f9c4d668929d3"
  },
  {
    "url": "integrations/index.html",
    "revision": "82b67a9e8d359da75c926d60b12e4db4"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "fa4846c9827335679af12b4ca3b4d229"
  },
  {
    "url": "integrations/shell.html",
    "revision": "32bcb5a3826494b39757c102da1ad9b7"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "62ac778b6ce25a36ba9e1a9af01a119e"
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
