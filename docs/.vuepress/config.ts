import { DefaultThemeOptions, defineUserConfig } from "vuepress";

export default defineUserConfig<DefaultThemeOptions>({
  title: 'room-assistant',
  description: 'A companion software to bring your home automation to the room-level for presence detection and more.',
  plugins: [
    [
      '@vuepress/pwa',
      {
        skipWaiting: true
      }
    ],
    [
      '@vuepress/docsearch',
      {
        apiKey: '122374495be1e51186e78b13b1169885',
        indexName: 'room-assistant'
      }
    ]
  ],
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
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
    docsDir: 'docs',
    docsBranch: 'main',
    logo: '/room-assistant.png',
    navbar: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Integrations', link: '/integrations/' },
      { text: 'Forum', link: 'https://github.com/mKeRix/room-assistant/discussions' },
      { text: 'Sponsor', link: 'https://github.com/mKeRix/room-assistant?sponsor=1' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          isGroup: true,
          children: [
            '/guide/README.md',
            '/guide/installation.md',
            '/guide/upgrading.md',
            '/guide/configuration.md',
            '/guide/cluster.md',
            '/guide/entities.md',
            '/guide/monitoring.md',
            '/guide/cli.md',
            '/guide/api.md'
          ]
        },
        {
          text: 'Quickstart',
          isGroup: true,
          children: [
            '/guide/quickstart-pi-zero-w.md',
            '/guide/quickstart-pi.md',
            '/guide/quickstart-ansible.md',
            '/guide/quickstart-docker.md'
          ]
        }
      ],
      '/integrations/': [
        {
          text: 'Integrations',
          isGroup: true,
          children: [
            '/integrations/README.md',
            '/integrations/home-assistant.md',
            '/integrations/mqtt.md',
            '/integrations/bluetooth-low-energy.md',
            '/integrations/bluetooth-classic.md',
            '/integrations/xiaomi-mi.md',
            '/integrations/omron-d6t.md',
            '/integrations/grid-eye.md',
            '/integrations/gpio.md',
            '/integrations/shell.md'
          ]
        }
      ]
    }
  }
});
