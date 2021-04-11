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
    "revision": "4200f0062484fbfca1e4f858680e9d3f"
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
    "url": "assets/js/10.4270844b.js",
    "revision": "193d1d0cb4ea4bde18a3d8e7be94a7b1"
  },
  {
    "url": "assets/js/11.7f8cc2d4.js",
    "revision": "05a1a2374e88693e7d04a1296923102d"
  },
  {
    "url": "assets/js/12.f6dd4e39.js",
    "revision": "391e3c8e665ad17d041a18b57f020580"
  },
  {
    "url": "assets/js/13.aaf69015.js",
    "revision": "627214c6e868577a2ab11d08c24db656"
  },
  {
    "url": "assets/js/14.15c564d4.js",
    "revision": "435a698dde17e6ddf9626edcf736060e"
  },
  {
    "url": "assets/js/15.883e33f9.js",
    "revision": "39d142607ed87a26997e5e846fb56804"
  },
  {
    "url": "assets/js/16.3c04e462.js",
    "revision": "f41ce14d7ba4adc3fec153eadfe2c9b1"
  },
  {
    "url": "assets/js/17.df5d0d0c.js",
    "revision": "e6f5f74b380196ee04e56fd188ce13da"
  },
  {
    "url": "assets/js/18.b2c12682.js",
    "revision": "155eb49d5d6600542a96fb585af0079d"
  },
  {
    "url": "assets/js/19.70d65d7c.js",
    "revision": "677a9e310fda77f483fe10c96e18551e"
  },
  {
    "url": "assets/js/20.222f6957.js",
    "revision": "042baf85f771cc899365b29f59079f8b"
  },
  {
    "url": "assets/js/21.bfbe7394.js",
    "revision": "ede862508e5fec9a2ed11413678245e6"
  },
  {
    "url": "assets/js/22.f6fb9691.js",
    "revision": "afa950341fca36f68a31a30c684ebc63"
  },
  {
    "url": "assets/js/23.70c2cac8.js",
    "revision": "f4f2b8c7da49310e8e10bcd857375640"
  },
  {
    "url": "assets/js/24.c6248db4.js",
    "revision": "74525134b7397d1d180dd8b259d967a6"
  },
  {
    "url": "assets/js/25.b1150f04.js",
    "revision": "1ae9c8fb2b0cf1288037b626042be55b"
  },
  {
    "url": "assets/js/26.0989eab2.js",
    "revision": "fc24aebf70201cb27b5a8eaa3c55ad5e"
  },
  {
    "url": "assets/js/27.68c0b178.js",
    "revision": "85f0b73d3682c593180d2dad2e07cb49"
  },
  {
    "url": "assets/js/28.7e7a038d.js",
    "revision": "a9fc743ad907f3397d63590d6d626a7d"
  },
  {
    "url": "assets/js/29.398334c3.js",
    "revision": "9772ced80ee241b99f0b283dc79e4f1c"
  },
  {
    "url": "assets/js/3.959a20dc.js",
    "revision": "c322016727df9c3a1ac7e06d3793213e"
  },
  {
    "url": "assets/js/30.b2eb359f.js",
    "revision": "d1a8021453f27d71f40e196ddd04356a"
  },
  {
    "url": "assets/js/31.be25bdab.js",
    "revision": "567a8b7c8dc583dea5af8592d0a8f8bf"
  },
  {
    "url": "assets/js/32.b28b3a10.js",
    "revision": "27aeb75191296ded7f2feeba9e8f3236"
  },
  {
    "url": "assets/js/33.d293d6a3.js",
    "revision": "52220e91d4b386d125726561a2932dce"
  },
  {
    "url": "assets/js/4.62f8ef60.js",
    "revision": "d6545557369e472914c3fa974c458ba3"
  },
  {
    "url": "assets/js/5.b1f05a87.js",
    "revision": "61c75c6233ff34d81971a992f8998218"
  },
  {
    "url": "assets/js/6.a3365854.js",
    "revision": "2b3e394a26a6147d5d3c0c8d16a27b37"
  },
  {
    "url": "assets/js/7.857717dd.js",
    "revision": "e76fba531a3f18ad51e0213c7b47bc11"
  },
  {
    "url": "assets/js/8.0fb3d8d7.js",
    "revision": "41a2d836d65e0e1f7f8bae7625047130"
  },
  {
    "url": "assets/js/9.09b75989.js",
    "revision": "5e1db5972e02b1e9175d52df74899276"
  },
  {
    "url": "assets/js/app.881bcd4a.js",
    "revision": "3d40710e9a3faf2e9daef37bcb01df28"
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
    "revision": "cfaf3b26ecbf8a5523e61ede64c5c6a1"
  },
  {
    "url": "guide/cli.html",
    "revision": "c57b07fcbd05f76d64bca41a89cecec6"
  },
  {
    "url": "guide/cluster.html",
    "revision": "fb19f57a3de700c6bac0544f1af0c235"
  },
  {
    "url": "guide/configuration.html",
    "revision": "75199c28860e6d67dd69d01ba53296a7"
  },
  {
    "url": "guide/entities.html",
    "revision": "b000b430635d99a0dfc4e050dc19124d"
  },
  {
    "url": "guide/index.html",
    "revision": "b32f360c54e1d2a29e3738db41da70aa"
  },
  {
    "url": "guide/installation.html",
    "revision": "a9ab283d4839d0fe78b9ef77a407eec2"
  },
  {
    "url": "guide/monitoring.html",
    "revision": "7f0bb6cd1a67da181d5f243a0523c46f"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "da8532a438b2b02fe2fb3957a3943666"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "b02052f6772a8ef0b5685cbd68c228ae"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "7355ded439161b70c90fb46b1a13677b"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "79e4f3c9f947fe7c082e57dbadcd8073"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "e89a4509345ef3f2891362ff9166cc5b"
  },
  {
    "url": "index.html",
    "revision": "f93e07915b2401b2038f05f86d15ee54"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "a6009f0d01de90a0950ec8d74ad07983"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "52f4979c008c042f6ec9ac4edf85bf62"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "41b9bbb47fd36531ba7e596a8ea60924"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "8ca2b93c15148b0fdefc0aa690db8446"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "b402a3ff37aae3534c4a997d87ea35a8"
  },
  {
    "url": "integrations/index.html",
    "revision": "0c5644738e0c5c8fa32e0343376680f0"
  },
  {
    "url": "integrations/mqtt.html",
    "revision": "6051d9c96c0e96f4f8576e79224f227c"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "b89de312864afe2ef002befd0b5bf10f"
  },
  {
    "url": "integrations/shell.html",
    "revision": "ed56db072ddd3718fedd18dca885aedc"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "6509e187db84a2bd1ea6289e418942fd"
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
