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
    "revision": "b0b073ef79ddccf6c8f79e0370ba0479"
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
    "url": "assets/js/10.76598841.js",
    "revision": "606fee8bbd831c7e18c1f24d9a45aefb"
  },
  {
    "url": "assets/js/11.7a7c1210.js",
    "revision": "f9465546c898df11b9b46f81bfed8a22"
  },
  {
    "url": "assets/js/12.994b0823.js",
    "revision": "0cb127f233624014a62d2ea2c87f730d"
  },
  {
    "url": "assets/js/13.44dbc8bf.js",
    "revision": "3b1776275d9c4738cbf46a01ab53549d"
  },
  {
    "url": "assets/js/14.d971cd95.js",
    "revision": "298dbfb72a0ce0676336c2ce5e844acb"
  },
  {
    "url": "assets/js/15.9a5f6798.js",
    "revision": "408dd418a3b9c0a650fb2b2cc359f5b6"
  },
  {
    "url": "assets/js/16.6cfa96fa.js",
    "revision": "d7f69716f56f9d4542b965e1684853ea"
  },
  {
    "url": "assets/js/17.9703629d.js",
    "revision": "f0eb5604fca9c9615d8fe47c8908f497"
  },
  {
    "url": "assets/js/18.aac9e02f.js",
    "revision": "9a96964c171c074dcf3b3419a15b361a"
  },
  {
    "url": "assets/js/19.e9135a96.js",
    "revision": "166848e5366c905a0aa08b775418292b"
  },
  {
    "url": "assets/js/20.88a8adfb.js",
    "revision": "e53af9241359e07d17a645791c81e6d2"
  },
  {
    "url": "assets/js/21.954d5641.js",
    "revision": "93d68079c6c21c9f0ac5fffc88820e8d"
  },
  {
    "url": "assets/js/22.fc32e666.js",
    "revision": "7698b4262bfaa49aa139271431fe2b30"
  },
  {
    "url": "assets/js/23.87a4726c.js",
    "revision": "0c57c6dc62a6a9dddbddd6bf8f68f1a3"
  },
  {
    "url": "assets/js/24.e20e2e83.js",
    "revision": "761c9f95b6eb9a8e23a20fe3a707fd10"
  },
  {
    "url": "assets/js/25.c2d94681.js",
    "revision": "7562a4c98d965dacf7bb049ad47ac11b"
  },
  {
    "url": "assets/js/26.a9a8f6ab.js",
    "revision": "c2be65129f8e542202c322c83ada4db7"
  },
  {
    "url": "assets/js/27.10bc339d.js",
    "revision": "0b8cb4fe90949e4972f32aa797b81147"
  },
  {
    "url": "assets/js/28.3615c2da.js",
    "revision": "7e034570cb75eb863a55f1a786b80ffe"
  },
  {
    "url": "assets/js/29.dff5eba3.js",
    "revision": "5acc251ce07e71d88257617cd04f3908"
  },
  {
    "url": "assets/js/3.27a179ad.js",
    "revision": "d3098db1761a7b85ddd22b27c9270cf6"
  },
  {
    "url": "assets/js/4.3bbfe409.js",
    "revision": "4a46d043242be03d9d45200b315c91c3"
  },
  {
    "url": "assets/js/5.d426df70.js",
    "revision": "bedb192be1e464e5a907f6ee12b97124"
  },
  {
    "url": "assets/js/6.f88015b0.js",
    "revision": "0861539a2c2f3dad29c36783f9ff5a72"
  },
  {
    "url": "assets/js/7.796b3031.js",
    "revision": "d3cfbba3c0fedf302e154a3a5f1182bd"
  },
  {
    "url": "assets/js/8.dca56cb7.js",
    "revision": "70331fe184b73b2cc30b2e8dc41ee5ee"
  },
  {
    "url": "assets/js/9.01425f33.js",
    "revision": "83f368c19529c555fc7e47e151fff60e"
  },
  {
    "url": "assets/js/app.3ecc4ff9.js",
    "revision": "3183dda3d70a0da19c3273c29ce39df3"
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
    "url": "guide/api.html",
    "revision": "d6817d6af422f8e421acb904c6607d80"
  },
  {
    "url": "guide/cli.html",
    "revision": "202911444abd7aa1fd83c9dd18d5d914"
  },
  {
    "url": "guide/cluster.html",
    "revision": "63cd649b35cb11d00e9585a09a1a2ff4"
  },
  {
    "url": "guide/configuration.html",
    "revision": "97710b5831b105c705d20381305200df"
  },
  {
    "url": "guide/entities.html",
    "revision": "f563e9b25b77e50d8a9e3a4f5900f965"
  },
  {
    "url": "guide/index.html",
    "revision": "287bffbb51a8577ed03c8a3b9156f6a4"
  },
  {
    "url": "guide/installation.html",
    "revision": "54a2196bf8144534df054c32481dc2d3"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "cae16d9b437a5e82fb25f0d3a55942c6"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "d3ff7cd3ff9b51e5ab9bd63b512a7ad6"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "fcabe469e463b73c1d480a569cbd49c4"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "44626571f017d728dc7d02e8c5c8467a"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "5eb5e896bf52662a94153f586b67fbe4"
  },
  {
    "url": "index.html",
    "revision": "42949d74b13766b7a2b73285d1690efd"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "5a81cbc68b563bb19f13ee72fc479379"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "0e09649cda890a4312a0570a0c495a76"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "b7432acc82ef56ef8fd4d3d8e4aeef03"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "7a0ce5230aa74dabced2ceb5846e7b3f"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "62bae9e24f0b8219a33eeb11c075f78d"
  },
  {
    "url": "integrations/index.html",
    "revision": "33bb812c5b479980916bdadb98a91602"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "43abaa6b92dd44f94d7bdb3373123a4c"
  },
  {
    "url": "integrations/shell.html",
    "revision": "68a5542cf0e87ef2d5f51ffa5c970aa2"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "d8e1eb75f474b1544daa74ba4b8805cc"
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
