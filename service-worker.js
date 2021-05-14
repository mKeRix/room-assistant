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
    "revision": "8b2735e940f78c03e4f8eae360545cc9"
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
    "url": "assets/css/0.styles.48ba20e3.css",
    "revision": "ad0eb4003ff3ae6c09aa10c2d17f49fb"
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
    "url": "assets/js/10.a81fa0cf.js",
    "revision": "0ff5e95e443b36f5da283010c7338122"
  },
  {
    "url": "assets/js/11.07bda8a7.js",
    "revision": "9f7984f52a6d22b40db4df11c25b8c70"
  },
  {
    "url": "assets/js/12.9a74024d.js",
    "revision": "55d02092be5470920505c0421ac2649d"
  },
  {
    "url": "assets/js/13.5ad86907.js",
    "revision": "4faa80fd1ec8f39f1eb47f8fb97dbd12"
  },
  {
    "url": "assets/js/14.facbb4d2.js",
    "revision": "d2dc1241f0bc378e78a414ef0765c6eb"
  },
  {
    "url": "assets/js/15.56727f77.js",
    "revision": "13dd59502d9b855fac9f4f58a951055b"
  },
  {
    "url": "assets/js/16.dd49818f.js",
    "revision": "0f4c65137100bab0e5581951a8603eed"
  },
  {
    "url": "assets/js/17.250d984e.js",
    "revision": "96a423ba14385feca7b5e109eed1f33c"
  },
  {
    "url": "assets/js/18.ef383a6d.js",
    "revision": "e29fc2c45833d012d1ffd9c59740aaf0"
  },
  {
    "url": "assets/js/19.52ffb0c3.js",
    "revision": "0417d682c1a94ba313fa7e1abd0b62de"
  },
  {
    "url": "assets/js/20.a5b7f324.js",
    "revision": "d891283303df9b14df80c4c454899503"
  },
  {
    "url": "assets/js/21.a26f2633.js",
    "revision": "26cc39e028435d121226ecba205946ba"
  },
  {
    "url": "assets/js/22.24561241.js",
    "revision": "10d896f1ace0c44843332a69b9d0c936"
  },
  {
    "url": "assets/js/23.dcfa44ca.js",
    "revision": "2757601c0fc836e0e76c76a9c1803dea"
  },
  {
    "url": "assets/js/24.d47bf453.js",
    "revision": "8dd34024ba919a21fdde91cfce52da41"
  },
  {
    "url": "assets/js/25.35f64fa0.js",
    "revision": "de552c0a4f800f204f90f49d1ba282e8"
  },
  {
    "url": "assets/js/26.3acbfb0f.js",
    "revision": "420f85ff7db6bdecc0f272fe615e7948"
  },
  {
    "url": "assets/js/27.926f1209.js",
    "revision": "5ce8cc10a86b0a24f4a2c49ad78c1fed"
  },
  {
    "url": "assets/js/28.cfb60cbf.js",
    "revision": "31e91893838b467bc878b192c889066a"
  },
  {
    "url": "assets/js/29.d39864dc.js",
    "revision": "16ab42dddbca8b89e6f6ee646caaf857"
  },
  {
    "url": "assets/js/3.a5a90e99.js",
    "revision": "fbba5e1f02cae08a84f3e9d33e70f118"
  },
  {
    "url": "assets/js/30.83383161.js",
    "revision": "1e53acb390d4052e10674ce749e7bc72"
  },
  {
    "url": "assets/js/31.dd835afd.js",
    "revision": "62d634d642689c607c87b2a3f5d8b609"
  },
  {
    "url": "assets/js/32.1637358c.js",
    "revision": "d0a45a9457833a3af22a7e817645a94e"
  },
  {
    "url": "assets/js/33.e65ddf61.js",
    "revision": "d6ffa801c6de847d4fef5dd6c4e0f76a"
  },
  {
    "url": "assets/js/34.d4a58828.js",
    "revision": "d5f75914801230b9200d3c47ac5f1afd"
  },
  {
    "url": "assets/js/4.f3319c52.js",
    "revision": "aa2b7c41a2305053033683dd19a774d5"
  },
  {
    "url": "assets/js/5.cc5b1316.js",
    "revision": "19ed2d6bb171b14197bb992928c6f2d1"
  },
  {
    "url": "assets/js/6.dc742a8c.js",
    "revision": "1210684951a371f31b407d4a51a7e103"
  },
  {
    "url": "assets/js/7.4085e0ca.js",
    "revision": "142491961edb93e8357943598e539aeb"
  },
  {
    "url": "assets/js/8.ea1e9643.js",
    "revision": "f40cce14ae015e54f38945ca07a3d55c"
  },
  {
    "url": "assets/js/9.186b46a2.js",
    "revision": "fabe95d2ae16621630ec12fff57f9148"
  },
  {
    "url": "assets/js/app.d8b38a69.js",
    "revision": "677fd9a6d7ed4e8fa0dd895ff1fcf817"
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
    "revision": "cf1596de3a4bd3d5f22bc5973bece451"
  },
  {
    "url": "guide/cli.html",
    "revision": "9ef578711bdf833a2a0912503208b302"
  },
  {
    "url": "guide/cluster.html",
    "revision": "50ab6a0838f8814ddb43be027d808c00"
  },
  {
    "url": "guide/configuration.html",
    "revision": "3c3e455aae99c373d897d7cffa33420a"
  },
  {
    "url": "guide/entities.html",
    "revision": "ca2a760bf6283feb409875bd348ebb59"
  },
  {
    "url": "guide/index.html",
    "revision": "6b15ca73386c48bb7e67603767f3aa0d"
  },
  {
    "url": "guide/installation.html",
    "revision": "e463694772a48cacdd1bbeb3a3a7cd23"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "491f9195c71006838171269ef78dc28a"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "b6b00b23154c4e57557c5807637a18ee"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "1b4d5af1c05cbad04b2838e095e7a345"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "f697565a8732141c2db6d83f8dca9b34"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "3d934dbb10871f875947a12a0483cf5c"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "e8eb9d70a4ea6446cf28e494c461f9ff"
  },
  {
    "url": "index.html",
    "revision": "819ab3b0bb6a7190fbc8c05306d8938c"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "49a57ee958500a68fefda0111d673268"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "d3aefa84ed31a5574bc2d5dda58bba43"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "fa921897644d15b077e508b5d9d9093e"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "21b277f6ae229359bec176a05aa05c6d"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "f2e47e8d34f8853f70e8849ccd0f03ff"
  },
  {
    "url": "integrations/index.html",
    "revision": "fc1a3ff87f792b9482ba3c2791e7f5f3"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "68b5eceacbf52fd750f27a8e56f709bd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "a68bf9c50b4c9f5b76683ef9bfa704ed"
  },
  {
    "url": "integrations/shell.html",
    "revision": "6aecdae51a6e405be2807aad17a32e1a"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "7b309994e89784bc1aa3c025ad5dcedb"
  },
  {
    "url": "mstile-150x150.png",
    "revision": "5461702e6d17101516497b481857edd8"
  },
  {
    "url": "privacy.html",
    "revision": "4f07567aec168cce7e1cc6a38e1bb73c"
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
