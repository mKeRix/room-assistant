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
    "revision": "bff063f11c7ade4d935b5f2fdb6e949c"
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
    "url": "assets/css/0.styles.4544e1c1.css",
    "revision": "1ef651a3691408fde72dbb615a070c8d"
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
    "url": "assets/js/10.f9758ef0.js",
    "revision": "09e44c13034e8edd2cc26a060b11c105"
  },
  {
    "url": "assets/js/11.4e4d947b.js",
    "revision": "b88c4abe48a4fa5af1e24f1848fe3bfa"
  },
  {
    "url": "assets/js/12.1a725e32.js",
    "revision": "330bbd52fb692b48a5213b7d3c1f4125"
  },
  {
    "url": "assets/js/13.a00d7a1b.js",
    "revision": "9cd710cc33c47b148b09bd31d0fc6858"
  },
  {
    "url": "assets/js/14.b7609b93.js",
    "revision": "41380030ab9a30c1015f30182f04b08e"
  },
  {
    "url": "assets/js/15.45d48145.js",
    "revision": "48eb2047c3dfa8c3fd2b72b550119d62"
  },
  {
    "url": "assets/js/16.3965d308.js",
    "revision": "3d4913d7ddd9fc24627598bd7aeb5fdc"
  },
  {
    "url": "assets/js/17.c7ce162a.js",
    "revision": "98c6ceb6c56dffedb1604a265ac4b17f"
  },
  {
    "url": "assets/js/18.aae104db.js",
    "revision": "3173dc718e3dc50ec1fc7a8c16baedb4"
  },
  {
    "url": "assets/js/19.68a1f84d.js",
    "revision": "b26b7a88e8bed5ecf71b6533d348d29c"
  },
  {
    "url": "assets/js/20.77a4ea5b.js",
    "revision": "71f57954007c0e9384f739a89d5b06f0"
  },
  {
    "url": "assets/js/21.aa13f177.js",
    "revision": "24ffff8557130d6eef707eb809585753"
  },
  {
    "url": "assets/js/22.7381030f.js",
    "revision": "a16316a87dd7ca7ddf0ee39cabf298f4"
  },
  {
    "url": "assets/js/23.dae13008.js",
    "revision": "f33b89b0019367918d3d2a8eae76a266"
  },
  {
    "url": "assets/js/24.b1108c28.js",
    "revision": "4b8da8ec69d2b72a8e7266658f9b5e78"
  },
  {
    "url": "assets/js/25.69fe8821.js",
    "revision": "a460a06405d51e3bd3e29aa900ce2352"
  },
  {
    "url": "assets/js/26.0ba2d465.js",
    "revision": "288c578a2ee975928b64cd3fb167e4f2"
  },
  {
    "url": "assets/js/27.483705e1.js",
    "revision": "6d3d17605bb01cecae659f556b19ac5b"
  },
  {
    "url": "assets/js/28.43dfa07a.js",
    "revision": "f48c133abb63a2c0141fead7f99aaeb7"
  },
  {
    "url": "assets/js/29.8ac4adff.js",
    "revision": "d20303a27b0cb14e6c872d84357a7235"
  },
  {
    "url": "assets/js/3.1fd81150.js",
    "revision": "494af1b388670c539193b84eb53d5269"
  },
  {
    "url": "assets/js/30.f9e20266.js",
    "revision": "8cae8a7ed905189c11b1eab01490af45"
  },
  {
    "url": "assets/js/31.50f91f32.js",
    "revision": "84d27a333a22c4bfbcd3f1f1406ec208"
  },
  {
    "url": "assets/js/32.d3a54443.js",
    "revision": "4feed54b5860829b1c8933427d2af09d"
  },
  {
    "url": "assets/js/33.a7db9174.js",
    "revision": "cce350867407931fc73e54c1c388f4c9"
  },
  {
    "url": "assets/js/4.e7a8ccd2.js",
    "revision": "ac22832cdbf19fa3b830212812fe7499"
  },
  {
    "url": "assets/js/5.d9380f48.js",
    "revision": "5c0f78a2db9c4001d04656ef29c4e361"
  },
  {
    "url": "assets/js/6.553f5edc.js",
    "revision": "20c8f49ee0bd4ecd7f3271ac31337cfb"
  },
  {
    "url": "assets/js/7.af975ce7.js",
    "revision": "56d31eb166da9f072e52fbf75a6aec33"
  },
  {
    "url": "assets/js/8.0df2817a.js",
    "revision": "d92257448ea2fbb5d2cc693d41351047"
  },
  {
    "url": "assets/js/9.d383bb73.js",
    "revision": "90c50b142801b746d3f6a60147db56fa"
  },
  {
    "url": "assets/js/app.d67c9df6.js",
    "revision": "e59bb4c73e0a6af3b9892b451c3de10d"
  },
  {
    "url": "assets/js/vendors~docsearch.eec9cc92.js",
    "revision": "bc8a3e4a2fa0b7efddc04c11bb7a21a3"
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
    "revision": "f22f13c76b257baa508b8646af0f2c47"
  },
  {
    "url": "guide/cli.html",
    "revision": "56b815bed1d01e7165b7f7d129cec45d"
  },
  {
    "url": "guide/cluster.html",
    "revision": "7a368c73e1c5679c2c226b761d5aef53"
  },
  {
    "url": "guide/configuration.html",
    "revision": "c2656e1309715ddb1512e56475667e83"
  },
  {
    "url": "guide/entities.html",
    "revision": "891ebd5141885b3b1c302c66296f78ad"
  },
  {
    "url": "guide/index.html",
    "revision": "87ed4a875ee47dd411abfa539b0c4092"
  },
  {
    "url": "guide/installation.html",
    "revision": "680dd3accaf43768b0bd0464f538fcee"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "001c6cfb1b01a0fc994f307dc7c1450c"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "0488eb1297348b8e0c9fdca97dd03ac1"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "f92fa63aaf4079d71116e142a54e41ab"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "5e3399626bbf1ac4972e4098092ae3ff"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "1e112cdc39495d146eefb972597ef516"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "a27d2ef26cca68d5ec8546612a0ece67"
  },
  {
    "url": "index.html",
    "revision": "6f53aab60172f0b239c364df7ed3f100"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "f5bae34d7bf3db3641acd26b02bf3573"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "17c813ca5d6a1274e3da652d068844d0"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "31eefe39e168466c683cd09adba6a659"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "d78cde6aa6d68fa577f3481b313a5194"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "91aa315f21bf7f3c6953631a79f2c7f3"
  },
  {
    "url": "integrations/index.html",
    "revision": "1e2e78632b179bf1e03ba58762e2f370"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "14e28b3ff96f95c56c645babaf4e0c36"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "20f37b3553652178026125141e410632"
  },
  {
    "url": "integrations/shell.html",
    "revision": "1186aba746ad7d3523d0addc4d29c854"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "0b804c681e735b28f4cdf16c57958cd2"
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
