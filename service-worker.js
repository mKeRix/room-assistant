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
    "revision": "675e153ff6298dde6d7bf11adf9f45cb"
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
    "url": "assets/js/33.82d635c8.js",
    "revision": "1e1365e7bb8510c02716a09f71db7026"
  },
  {
    "url": "assets/js/4.8ddcff98.js",
    "revision": "5de878505d03709e6f1df2807aa54d05"
  },
  {
    "url": "assets/js/5.7e9e3e68.js",
    "revision": "89cbff024c36ea69913bc31edb1a3b2f"
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
    "url": "assets/js/app.7e8cb795.js",
    "revision": "1a069bb62d3be4d254cc6de554626eae"
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
    "revision": "fab487586dab07295e2a822c784b24a0"
  },
  {
    "url": "guide/cli.html",
    "revision": "acf03c6746baa3a7a171141a0dc5ef43"
  },
  {
    "url": "guide/cluster.html",
    "revision": "35c5347a97cb182c42fb5605a1e587ce"
  },
  {
    "url": "guide/configuration.html",
    "revision": "2411061aad71cb173288537dc48fef51"
  },
  {
    "url": "guide/entities.html",
    "revision": "4d6712be4824e0fb432c995c51e6e8c0"
  },
  {
    "url": "guide/index.html",
    "revision": "a533ba8d98bc6a16df7247897636a656"
  },
  {
    "url": "guide/installation.html",
    "revision": "e955b9eeb7bce26d790c7750d610bdc2"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "39e65d085da090475ed75622161df91f"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "50a2a096fa242f70ead23aee7e434631"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "8d892182a43dd6ab9f09f46931749a25"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "6b00049863653a99b2da0d7c161fade8"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "2574be9cb690389182184800bf3d88f0"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "8ab5d7be631f809241f4ee9c3e81f7a0"
  },
  {
    "url": "index.html",
    "revision": "b57a9e8d3986b88decc123defae18d33"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "e94787690caed7d07af59d4c7c309902"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "6bb40d4871d8aebf14641887aee683f0"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "99677a5b4a4e09e02b20bf573a7336a6"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "eee00dc8dfe49ed709f0dd74a7832759"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "22276462e38558d86bcb6a0a970168be"
  },
  {
    "url": "integrations/index.html",
    "revision": "104e1719795caaf8ff24cc67d0d20c2f"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "b50ba27104b28b9d51ca40681bbeafbd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "11e3c849c7f9431aa07db7817fcfce28"
  },
  {
    "url": "integrations/shell.html",
    "revision": "62347011ae71d689f2b18bd14dd7ce57"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "c03cfb509512902e6f73ccfc6676873d"
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
