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
    "revision": "83ffcd0f2dca0f3fdd3ebce54c951548"
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
    "url": "assets/js/10.158b14ac.js",
    "revision": "e120646634dac01f7a18b2840a4889e0"
  },
  {
    "url": "assets/js/11.4d14230a.js",
    "revision": "7615fb873164b7e54b4352f880cf4c39"
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
    "url": "assets/js/28.0af320dd.js",
    "revision": "95f5bd57794ebddd1ade5677ec8a9997"
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
    "url": "assets/js/31.eed29852.js",
    "revision": "631a73f0cf8bd5f20c2b65bee4af6a56"
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
    "url": "assets/js/8.25bc535b.js",
    "revision": "4e45365d12dc987b86cc0bf18b2e9e9b"
  },
  {
    "url": "assets/js/9.f00c15bb.js",
    "revision": "4f76d29133fa859f4813c4ce3cdaf3a2"
  },
  {
    "url": "assets/js/app.f4f0c4f8.js",
    "revision": "88001b774b527d67a92dd9bed065ce28"
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
    "revision": "70bc468332cb1260dfb8607483418c6f"
  },
  {
    "url": "guide/cli.html",
    "revision": "72e4dd29c07e9f7156688a4ce6ae6280"
  },
  {
    "url": "guide/cluster.html",
    "revision": "41b1ed959ce9f1daf2e2be8a7c4b56dc"
  },
  {
    "url": "guide/configuration.html",
    "revision": "b0c41fcec7a563f4e7f34425c85ff61d"
  },
  {
    "url": "guide/entities.html",
    "revision": "9578efe9791b06df516adf05890c0a50"
  },
  {
    "url": "guide/index.html",
    "revision": "5e732cfa589df0cc1f44a0b4cbb16b30"
  },
  {
    "url": "guide/installation.html",
    "revision": "b97634347386538caf53752d41f4cdf9"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "f7a148ecf3cfb4b68271891f14ce9e41"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "13a239bc99de79a5caa15278df0043bf"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "a587502387ba618edcdba3e897315675"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "36b8bd12526224f007edd244d55b47f8"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "a274923319bdbc0560139bf577c8b42a"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "f0dd49c5afdab33251f58257439f10df"
  },
  {
    "url": "index.html",
    "revision": "7527931a460942097f30409c06d1307c"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "889bcae6c331be7e0c5837c28f05b493"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "1bf13522f8bd90708bf469e4e4a22e31"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "8ecc6b3726c6c7d9c928e4f32b21c4ee"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "92e0ee1d3b69a1f5069ce504945615f6"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "feddf5612fd73930ff3287f6aa47dae5"
  },
  {
    "url": "integrations/index.html",
    "revision": "8da5f8f52f981707f15cd5445b84bf65"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "1a9ca8595334a9a49cd569582b543cfd"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "eed0d0677365f92cd80b902a18ad2b13"
  },
  {
    "url": "integrations/shell.html",
    "revision": "637f561a23adc91979e9ee66d364370d"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "0669e75a84fccc4678442743563aed29"
  },
  {
    "url": "mstile-150x150.png",
    "revision": "5461702e6d17101516497b481857edd8"
  },
  {
    "url": "privacy.html",
    "revision": "78a664d22cbf29613d76d60d5aaff484"
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
