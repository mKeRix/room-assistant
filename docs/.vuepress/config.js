module.exports = {
  title: 'room-assistant',
  description: 'A companion software to bring your home automation to the room-level for presence detection and more.',
  plugins: ['vuepress-plugin-clean-urls'],
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
    repo: 'mKeRix/room-assistant',
    editLinks: true,
    lastUpdated: true,
    docsDir: 'docs',
    nav: [
      { text: 'Documentation', link: '/guide/' }
    ],
    sidebar: {
      '/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '/guide/',
            '/guide/installation',
            '/guide/configuration'
          ]
        },
        {
          title: 'Integrations',
          collapsable: false,
          children: [
            '/integrations/home-assistant',
            '/integrations/bluetooth-low-energy',
            '/integrations/bluetooth-classic',
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
