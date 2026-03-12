import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vite/',

  title: "My Awesome Project",
  description: "A VitePress Site",

  themeConfig: {
    nav: [
      { text: 'Домой', link: '/' },
      { text: 'Заметки', link: '/markdown' }
    ],

    sidebar: [
      {
        text: 'Examples',
        collapsed: true,
        items: [
          { text: 'Markdown', link: '/markdown' },
          { text: 'VitePress', link: '/vitepress' },
          { text: 'Hi', link: '/hi' },
          { text: 'Hi', link: '/ex/hi_too' }
        ]
      },
      {
        text: 'Examples 2',
        collapsed: true,
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Hi', link: '/hi' },
          { text: 'Hi', link: '/ex/hi_too' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'vk', link: 'https://vk.com/jenit777' }
    ]
  }
})