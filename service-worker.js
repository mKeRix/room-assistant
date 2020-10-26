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
    "revision": "8119d206986e2e3c9168dc62ce62d4be"
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
    "url": "assets/js/14.998a6706.js",
    "revision": "689259e2e04333b779cd70eda7c8bb89"
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
    "url": "assets/js/app.b5137afb.js",
    "revision": "6a623fb1358239e68a629d23487a6d60"
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
    "revision": "7e8599c96fd7591fc13f70ad2f4cc4bd"
  },
  {
    "url": "guide/cli.html",
    "revision": "7dfcf30461d57acaf357ac9bbc02cef0"
  },
  {
    "url": "guide/cluster.html",
    "revision": "0465ba4bdbba7cd442f0b6f440ab5dcb"
  },
  {
    "url": "guide/configuration.html",
    "revision": "c19f54a34071e7452979ae8fbc527554"
  },
  {
    "url": "guide/entities.html",
    "revision": "e18e7fae489a63e39be6248d7de9a7ff"
  },
  {
    "url": "guide/index.html",
    "revision": "1a6115b35e6fed84f4ad4e5f8ffb7171"
  },
  {
    "url": "guide/installation.html",
    "revision": "100ad1602c9b3f0dbb21365240a71189"
  },
  {
    "url": "guide/quickstart-ansible.html",
    "revision": "7fab6d1c615bb64a203982f7fe7f258b"
  },
  {
    "url": "guide/quickstart-docker.html",
    "revision": "a50980dbf3c6ed32821c066fab64f66e"
  },
  {
    "url": "guide/quickstart-pi-zero-w.html",
    "revision": "83c799d29a9612045ed22ac95849321c"
  },
  {
    "url": "guide/quickstart-pi.html",
    "revision": "51358862ad18eca9da36479c2d3b1030"
  },
  {
    "url": "guide/upgrading.html",
    "revision": "c935c73b959e0d14410d544a801585e9"
  },
  {
    "url": "index.html",
    "revision": "9dc68af1e061da97c386c1e8bd5a3c87"
  },
  {
    "url": "integrations/bluetooth-classic.html",
    "revision": "586d3fef8c5457463bc506aaccf80e66"
  },
  {
    "url": "integrations/bluetooth-low-energy.html",
    "revision": "7b63eb5975528ed6a15ffdfe3079957f"
  },
  {
    "url": "integrations/gpio.html",
    "revision": "1c168c29c56dd1b43505c52c6bb71fbf"
  },
  {
    "url": "integrations/grid-eye.html",
    "revision": "85ec6f42a5c1b236ffcf56075b114d1c"
  },
  {
    "url": "integrations/home-assistant.html",
    "revision": "722512352fb23a680434cc0fe5a35827"
  },
  {
    "url": "integrations/index.html",
    "revision": "64eb8e9ac12862ff24f88b010d28a683"
  },
  {
    "url": "integrations/omron-d6t.html",
    "revision": "4120f01270e12d89cd597d94332ba520"
  },
  {
    "url": "integrations/shell.html",
    "revision": "a595863affafd39e33b5a65bb18aaaa9"
  },
  {
    "url": "integrations/xiaomi-mi.html",
    "revision": "5f18ce87603279fb242897834cbb741d"
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
