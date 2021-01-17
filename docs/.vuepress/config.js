module.exports = {
  title: 'room-assistant',
  description: 'A companion software to bring your home automation to the room-level for presence detection and more.',
  plugins: [
    'vuepress-plugin-seo',
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      }
    ],
    [
      'sitemap',
      {
        hostname: 'https://www.room-assistant.io'
      }
    ]
  ],
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#2d89ef' }],
    ['meta', { name: 'msapplication-TileColor', content: '#2d89ef' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }]
  ],
  themeConfig: {
    domain: 'www.room-assistant.io',
    author: {
      name: 'Heiko Rothe',
      twitter: '@mKeRix'
    },
    repo: 'mKeRix/room-assistant',
    editLinks: true,
    lastUpdated: true,
    docsDir: 'docs',
    algolia: {
      apiKey: '122374495be1e51186e78b13b1169885',
      indexName: 'room-assistant'
    },
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Integrations', link: '/integrations/' },
      { text: 'Forum', link: 'https://github.com/mKeRix/room-assistant/discussions' },
      { text: 'Sponsor', link: 'https://github.com/mKeRix/room-assistant?sponsor=1' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '/guide/',
            '/guide/installation',
            '/guide/upgrading',
            '/guide/configuration',
            '/guide/cluster',
            '/guide/entities',
            '/guide/monitoring',
            '/guide/cli',
            '/guide/api'
          ]
        },
        {
          title: 'Quickstart',
          collapsable: false,
          children: [
            '/guide/quickstart-pi-zero-w',
            '/guide/quickstart-pi',
            '/guide/quickstart-ansible',
            '/guide/quickstart-docker'
          ]
        }
      ],
      '/integrations/': [
        {
          title: 'Integrations',
          collapsable: false,
          children: [
            '/integrations/',
            '/integrations/home-assistant',
            '/integrations/bluetooth-low-energy',
            '/integrations/bluetooth-classic',
            '/integrations/xiaomi-mi',
            '/integrations/omron-d6t',
            '/integrations/grid-eye',
            '/integrations/gpio',
            '/integrations/shell'
          ]
        }
      ]
    }
  }
};
