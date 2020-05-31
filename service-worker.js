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
    "revision": "97a8b478d21984fc5ab60f0c83ec3777"
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
    "url": "assets/js/11.091454ec.js",
    "revision": "7ebe938c2083052d9e28357d46196580"
  },
  {
    "url": "assets/js/12.2875a4c7.js",
    "revision": "4bace43dce08b101c564b0906852e134"
  },
  {
    "url": "assets/js/13.8b2ba897.js",
    "revision": "9e8ff77ee9e443d76817f89fe559cd48"
  },
  {
    "url": "assets/js/14.ac3803a8.js",
    "revision": "662f37d63e35e5dfe616bec028376f80"
  },
  {
    "url": "assets/js/15.62942376.js",
    "revision": "9d974c4b1ccdaefdb68b9752811df3ad"
  },
  {
    "url": "assets/js/16.b8826056.js",
    "revision": "71c2f43030526011236e45a09c22eb6b"
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
    "url": "assets/js/24.36bac486.js",
    "revision": "a6c093d2f7d7c9ce8e5d82abe96de70e"
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
    "url": "assets/js/3.453d0849.js",
    "revision": "91b4e398093641a27ef2db68ca13d474"
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
    "url": "assets/js/6.d8418784.js",
    "revision": "e5d4edc9647b0d4a2d0c291680036bae"
  },
  {
    "url": "assets/js/7.2f6528b3.js",
    "revision": "f8575788403c9a882f2f5e4f325a4229"
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
    "url": "assets/js/app.20bf3118.js",
    "revision": "97587ddd4b38bc7199659b7ada534bf3"
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
    "revision": "606cb6033217d335e6dce311c39eb25d"
  },
  {
    "url": "guide/cli.html",
    "revision": "4037f9472f17d70d927e7fe6a5043228"
  },
  {
    "url": "guide/cluster.html",
    "revision": "2eb7381449bbed1131efbdd6ec97ab91"
  },
  {
    "url": "guide/configuration.html",
    "revision": "8f160160c3e2833e60d5aabeeaa1a499"
  },
  {
    "url": "guide/entities.html",
    "revision": "8509e651f6ab69173e415ebabb959f87"
  },
  {
    "url": "guide/index.html",
    "revision": "07ffe61a535231897252256b9a6e8b46"
  },
  {
    "url": "guide/installation.html",
    "revision": "d0fffecd473504d22b0d0fbc7391894f"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "77ebb03434cbc26e4fc5a4174c36b930"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "250a4e9db1b5eba8c368ab85883631c2"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "5fce2369933b2e695ecf7033ffc0bcd9"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "da034e9e116a9ee5b4a7058a8e38d37b"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "ea0a0b2f868c8f705ae9b42da57007e7"
  },
  {
    "url": "index.html",
    "revision": "2160ff8535aa6a4e882fdcdeb1b6cc90"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "e3d77f1c1761c1db4611ac5ea1998e4d"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "fb195f944ecf257edbb5bd1503e08327"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "d3e1d77429ad263ece70b916aeab581d"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "1367e90b7bbe1cdaa7d0e1e1d1231187"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "d35e0081698fb39c132fea50e154c907"
  },
  {
    "url": "integrations/index.html",
    "revision": "86f46efeb790f039e7f27b673a62a4e1"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "43e5fb08ec0c5ffd447f74057b3d35a0"
  },
  {
    "url": "integrations/shell.html",
    "revision": "59699d6d682b15edb66c907affbf756d"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "37e648ae8a115d4c27bddc842aa013ea"
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
