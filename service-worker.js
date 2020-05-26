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
    "revision": "8bb35d5a479f93d4b458aa6ba4e05e6f"
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
    "url": "assets/css/0.styles.94a3a7cc.css",
    "revision": "91ff600d037bb936c7dde50713156f4d"
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
    "url": "assets/js/10.f917257f.js",
    "revision": "3d75f344afde1b3884bb960f5666ba9b"
  },
  {
    "url": "assets/js/11.2e1798ec.js",
    "revision": "b91f2b5e0e1a186d4455191c4731bc21"
  },
  {
    "url": "assets/js/12.8aa1bee8.js",
    "revision": "88cde9c62f33cb4fb6484cb6a23c486e"
  },
  {
    "url": "assets/js/13.ac51f03a.js",
    "revision": "7d9fc838641d66f2f3437465e388d3b6"
  },
  {
    "url": "assets/js/14.8d17eabf.js",
    "revision": "238035bf4465e43ebf8dd208834fa779"
  },
  {
    "url": "assets/js/15.76392218.js",
    "revision": "43fae1b9ce54da4c22fa7cabf68819c3"
  },
  {
    "url": "assets/js/16.2d454910.js",
    "revision": "f1068178b566784731eaad4490e50cf9"
  },
  {
    "url": "assets/js/17.e5e2ddd1.js",
    "revision": "d1348e02766b2cdf9501b87e91b5d8c2"
  },
  {
    "url": "assets/js/18.038c6bfa.js",
    "revision": "5dd71c832ccf77659f9da88394cca877"
  },
  {
    "url": "assets/js/19.c3ae20bc.js",
    "revision": "698513adb26fba59c5937cc95aee5ea8"
  },
  {
    "url": "assets/js/20.0c118bc7.js",
    "revision": "d1a1de8af2fc284a2fdf16be379d0002"
  },
  {
    "url": "assets/js/21.f2da4604.js",
    "revision": "67ff5b610039adc99994459ca871c349"
  },
  {
    "url": "assets/js/22.a8b3e3d3.js",
    "revision": "a1c29089d76d9395b60086bb4c02e759"
  },
  {
    "url": "assets/js/23.5fb11cc5.js",
    "revision": "314102390653890058c891a9d4af2452"
  },
  {
    "url": "assets/js/24.f665a251.js",
    "revision": "f84a683a72f7a0a5e4cb9352275f312b"
  },
  {
    "url": "assets/js/25.0191c5c3.js",
    "revision": "c762be2a540e3fb78c8fc584e868d794"
  },
  {
    "url": "assets/js/26.0d93941a.js",
    "revision": "00fa77ecb804a7a40816127b4838161e"
  },
  {
    "url": "assets/js/27.53ae2424.js",
    "revision": "7a287a9e05e3a53c17790456bf95d85b"
  },
  {
    "url": "assets/js/28.b6d84294.js",
    "revision": "5b337e589b3e40e98181fc8964b4a7b0"
  },
  {
    "url": "assets/js/3.453d0849.js",
    "revision": "91b4e398093641a27ef2db68ca13d474"
  },
  {
    "url": "assets/js/4.3bbfe409.js",
    "revision": "4a46d043242be03d9d45200b315c91c3"
  },
  {
    "url": "assets/js/5.bac042bf.js",
    "revision": "a2b69414c12449dfa8e332f02137d3d1"
  },
  {
    "url": "assets/js/6.65069803.js",
    "revision": "49eab593fff77dfb633d3eb62485980f"
  },
  {
    "url": "assets/js/7.7c685407.js",
    "revision": "e64bd8aad0d10b10531fea3d9683015a"
  },
  {
    "url": "assets/js/8.7fe01f73.js",
    "revision": "4f1a8f2924b5e01b6e7ff790fa6e09d6"
  },
  {
    "url": "assets/js/9.a26491d5.js",
    "revision": "afd2ca33a3be7329d51bb158760d70e4"
  },
  {
    "url": "assets/js/app.d9b010e6.js",
    "revision": "e2e8feb24ff3358cc7707b2f374a8544"
  },
  {
    "url": "assets/js/vendors~docsearch.78bd9431.js",
    "revision": "f4c847ef7f69aaf33316bc52a28e7f70"
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
    "revision": "9dc51a608920028b23fdf7957930ff3c"
  },
  {
    "url": "guide/cluster.html",
    "revision": "9f9d12198b8425f0c456e980ba919501"
  },
  {
    "url": "guide/configuration.html",
    "revision": "5440d3aef9543c24c93f289c225db70d"
  },
  {
    "url": "guide/entities.html",
    "revision": "e4d2e868cf39981b5aa37acb432323cc"
  },
  {
    "url": "guide/index.html",
    "revision": "5c670654f3c780b809c43f0010b055e7"
  },
  {
    "url": "guide/installation.html",
    "revision": "3418148f0529e12df2a28894d4c12082"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "469728514b0b1e8a2b546a90e6c8f69d"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "e7c535f572bf8087e3e2d0977bb85bd7"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "76e0d6eee04a9a79b1a58c75209e36f3"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "d759eddc076a339565e18d959d19320e"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "8e1004efe33e1ee651066d4bd56fd736"
  },
  {
    "url": "index.html",
    "revision": "e98990a2d6d6949d7f04ccd71799dcb1"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "f3108ec13f7e767fad48096efba80116"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "30e2009957fdcdd2170a0a7f58f8deb7"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "151cb04f73d45373d8faa1ae519eaf2a"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "af20b01d05448ad367f8df15690c49fe"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "6150f6fd8de6ef72ddb9e18683a0a1dc"
  },
  {
    "url": "integrations/index.html",
    "revision": "b791d6c110cdc2b3ab1ab09e188e51b9"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "bba54249cbffc147acc2d5f08f77468a"
  },
  {
    "url": "integrations/shell.html",
    "revision": "f8607cf4940cdd31b7add52f0178a381"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "58baeba34f4e26e42cda06dd212d010d"
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
