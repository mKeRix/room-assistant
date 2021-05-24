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
    "revision": "c4bb2147a964e918da75b1bf742aa42a"
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
    "url": "assets/css/0.styles.45b58280.css",
    "revision": "5bcf35308e190e5146ce6e7fd8479f7b"
  },
  {
    "url": "assets/img/app-store-badge.2928664f.svg",
    "revision": "2928664fe1fc6aca88583a6f606d60ba"
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
    "url": "assets/js/10.3e3169c1.js",
    "revision": "7144010cf5d56acc75f891f3ab0e800c"
  },
  {
    "url": "assets/js/11.f3b7acbf.js",
    "revision": "42e2960518876ef4505003dbfc7e1eb6"
  },
  {
    "url": "assets/js/12.cc13ae2d.js",
    "revision": "b4cbef957877c3b3dbda7cca263161a0"
  },
  {
    "url": "assets/js/13.0e07294e.js",
    "revision": "632b8b8c67b16539c3bad87b1563b72f"
  },
  {
    "url": "assets/js/14.75d48d16.js",
    "revision": "b5f62915883f9e32bc3f80c1c5f5bd55"
  },
  {
    "url": "assets/js/15.63f1336b.js",
    "revision": "36bfa67e52c3bd7bb318babccd3f0db5"
  },
  {
    "url": "assets/js/16.efc9de3a.js",
    "revision": "ca490fd511f643d903182a86721e6042"
  },
  {
    "url": "assets/js/17.b1fe6080.js",
    "revision": "220e3a88f203489dd80a80fb622db401"
  },
  {
    "url": "assets/js/18.df4402f5.js",
    "revision": "c0870973006ffd382271ba5779ef816d"
  },
  {
    "url": "assets/js/19.acc44dea.js",
    "revision": "fc9247ec50ba0572775e56187dd98e2c"
  },
  {
    "url": "assets/js/20.54d55eb5.js",
    "revision": "a1b8ffd813930e4b79998c8e48c737f6"
  },
  {
    "url": "assets/js/21.8d88adf1.js",
    "revision": "616b14fd3fd8acaca04f257ad240ac7f"
  },
  {
    "url": "assets/js/22.9a0dac00.js",
    "revision": "c1d034ebea5ecdd3d7aa859522b1ded9"
  },
  {
    "url": "assets/js/23.1bcb55c2.js",
    "revision": "9be5d7c7efb825641745f4add73fc223"
  },
  {
    "url": "assets/js/24.078980d4.js",
    "revision": "362b464aa47d10b4aab1949268e33815"
  },
  {
    "url": "assets/js/25.e9a07193.js",
    "revision": "34573c1f06d6905ce7e28461affe6983"
  },
  {
    "url": "assets/js/26.c0337e5c.js",
    "revision": "c140a91c9d7e7e9f298b236bdd251a81"
  },
  {
    "url": "assets/js/27.0214163c.js",
    "revision": "437c780111efa8a3f94e9403c1a3bb9f"
  },
  {
    "url": "assets/js/28.e9682dc4.js",
    "revision": "2c39fba1861c0f74c7bbd5dc9182adec"
  },
  {
    "url": "assets/js/29.9911689c.js",
    "revision": "3f9b07753411e297a48e8ae8996e8722"
  },
  {
    "url": "assets/js/3.f3a37c3c.js",
    "revision": "0cc6d88073f682ff906f6b9c52c845c4"
  },
  {
    "url": "assets/js/30.0ca36a22.js",
    "revision": "414879ec691a1bdd6f422f955b842f1f"
  },
  {
    "url": "assets/js/31.ba86d775.js",
    "revision": "db91a992d2f14a4c08b18a0c3a40ca41"
  },
  {
    "url": "assets/js/32.6fd3dc4c.js",
    "revision": "1e1ad71d388ff0a1853f82cbffbbd354"
  },
  {
    "url": "assets/js/33.4b66aca6.js",
    "revision": "8f29975543599bc038980ea2d12698f0"
  },
  {
    "url": "assets/js/34.96165e5e.js",
    "revision": "9edc4cb8b4a1b26874f43ccc244df2ec"
  },
  {
    "url": "assets/js/4.d205f08f.js",
    "revision": "90ec64cacbb8e9f2d33b5ec1d9e34d7a"
  },
  {
    "url": "assets/js/5.c6425b1f.js",
    "revision": "38a0a272975f0479dad18781834ddf14"
  },
  {
    "url": "assets/js/6.243cd464.js",
    "revision": "c2326a4c33569d0564edff9642bc1435"
  },
  {
    "url": "assets/js/7.2ad04b01.js",
    "revision": "c0701220ea2131978a27ea12574a92d0"
  },
  {
    "url": "assets/js/8.af9600e6.js",
    "revision": "c43f0276c427d2171c760323b0319890"
  },
  {
    "url": "assets/js/9.a0fad002.js",
    "revision": "4151c61581b66f88648b956229af516d"
  },
  {
    "url": "assets/js/app.0db8b717.js",
    "revision": "f8d5121023b72ffd85c814f017a283e0"
  },
  {
    "url": "assets/js/vendors~docsearch.883d461f.js",
    "revision": "1664a34bb6581ffdd1ff8b4f46d79968"
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
    "revision": "d5f93014b6cb9cd6655f3d0f223bcbb5"
  },
  {
    "url": "guide/cli.html",
    "revision": "2db374286d94413511dcc627c63b7398"
  },
  {
    "url": "guide/cluster.html",
    "revision": "73ccedc69ebc004b4fb49c228fae9c60"
  },
  {
    "url": "guide/configuration.html",
    "revision": "6584964871f38e1fa3da770d87a9c889"
  },
  {
    "url": "guide/entities.html",
    "revision": "6d721aa66e81322915bc25d5d3e58530"
  },
  {
    "url": "guide/index.html",
    "revision": "9baeb96d84ce548ad104b37dc72fa068"
  },
  {
    "url": "guide/installation.html",
    "revision": "3d5dd4f3873c648c5e37378b3cc200a8"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "ba69eb63022f26ee61f04a577ca48e65"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "0e2380fe5e063fc206ed97841f25f9ac"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "09ca65f0a433ae6779e9531a5214ec45"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "ede151c8d34143b9397e566c495a1438"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "118fd8442cb49b3e118903ba3ac10fb0"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "13f4edb2ef0cac84fb9d4bd45c6fb843"
  },
  {
    "url": "index.html",
    "revision": "0b49470304bf7505aa8b6b9ca9cfd3a7"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "6a4c10f6832a2ff137fa672d49920f82"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "32380c33b8efda016b72678848c61759"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "fdc5858e42c6fd4d8198e57e2a0ec76c"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "2e4b3de1a1d9c7b71cfd52c466e62a2e"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "92ce22015f6b48048cbca8721038994a"
  },
  {
    "url": "integrations/index.html",
    "revision": "70aabfca9d920abb7bfe151e4a50cda6"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "34bb5b9d1e99b58184ee05a7ad29b7dd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "c78c8b16670aed219aed230ea2ab7913"
  },
  {
    "url": "integrations/shell.html",
    "revision": "ce9cca4eefbea8f311e62d89e8338780"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "fc1d1a6305bb1c1e6456a2a9ed235aa9"
  },
  {
    "url": "mstile-150x150.png",
    "revision": "5461702e6d17101516497b481857edd8"
  },
  {
    "url": "privacy.html",
    "revision": "bb37e02745218ca1690727284a66fc30"
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
