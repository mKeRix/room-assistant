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
    "revision": "f9569f6024266ee5cb4ed6e80a33e159"
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
    "url": "assets/js/10.4562fb7e.js",
    "revision": "62b7892be4c9c084a3967c5f781f7266"
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
    "url": "assets/js/25.93f1a1b1.js",
    "revision": "842647d41232c1edf426d6f0ceddff43"
  },
  {
    "url": "assets/js/26.82d7ad1f.js",
    "revision": "0c68306db0e0b2d4e9bece23fa7bb881"
  },
  {
    "url": "assets/js/27.dd5af51f.js",
    "revision": "dba06e6176aa3dce9c70b86839b4e7b1"
  },
  {
    "url": "assets/js/28.e52f3cef.js",
    "revision": "93c61586efee94c4e996cb29105ac17f"
  },
  {
    "url": "assets/js/29.b7ff3701.js",
    "revision": "ec6e3b7fca17742d7df963cad0b593ef"
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
    "url": "assets/js/9.38373d46.js",
    "revision": "c31a29fa0c18cc30806643cfbe471dff"
  },
  {
    "url": "assets/js/app.b601daed.js",
    "revision": "a9367b558b939782cc5ea63dd737ff40"
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
    "revision": "9bfd2d7dfec33a74f47c7d09552f291c"
  },
  {
    "url": "guide/cli.html",
    "revision": "3c42b7f8141588158d63d0f0bd410572"
  },
  {
    "url": "guide/cluster.html",
    "revision": "5d42dce91706d3fce3be357685881b94"
  },
  {
    "url": "guide/configuration.html",
    "revision": "3a90bd55ac1f0662a0eb7e258de1648a"
  },
  {
    "url": "guide/entities.html",
    "revision": "706173e0e0ef671e10e90d21a0035935"
  },
  {
    "url": "guide/index.html",
    "revision": "9b75f4cf5548afcf9783ed2415c1545d"
  },
  {
    "url": "guide/installation.html",
    "revision": "86c62b2f88eb06c5c23c7aa87b6e7ea7"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "8b66aa3ab0fa7aac67968876e4b69f2e"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "dfc380d26975ce81ddda5be9e24116da"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "372a071eb415ed92ea6e6947ff73318b"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "ced1d6f36066eb629923797edab9a90c"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "af595ded729db8867653daf88c98cb72"
  },
  {
    "url": "index.html",
    "revision": "9aa3c24ea03181031b5d9bc6afafdf3f"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "e914e033ceb4fa040cd6df4f043f5755"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "f45d674a39de8c71a883a56cc8f0adcb"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "783ec42d2afeb6a899dfeb3a64d390fa"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "51de3aae4f1fa072b471ee2695d8726c"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "42c707219cb62496f0e8f046ee5dbecf"
  },
  {
    "url": "integrations/index.html",
    "revision": "cffacf6b138066a0fe85c35afa848314"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "bfe2c7cac4222e92dcf6c7ecf9d33124"
  },
  {
    "url": "integrations/shell.html",
    "revision": "a777d07860846b1f2e79a7f6768fe2e5"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "2220486888cfda495f490b8e2af952f5"
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
