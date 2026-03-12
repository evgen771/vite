import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vite/',

  title: "Заметки",
  description: "Сделано с помощью VitePress",

  themeConfig: {
    nav: [
      { text: 'Домой', link: '/' },
      { text: 'Заметки', link: '/markdown' }
    ],

    sidebar: [
      {
        text: 'Заметки',
        collapsed: true,
        items: [
          { text: 'Markdown', link: '/markdown' },
          { text: 'VitePress', link: '/vitepress' },
          { text: 'Hi', link: '/hi' },
          { text: 'Hi', link: '/ex/hi_too' }
        ]
      },
      {
        text: 'Дубликат',
        collapsed: true,
        items: [
          { text: 'Markdown', link: '/markdown' },
          { text: 'VitePress', link: '/vitepress' },
          { text: 'Hi', link: '/hi' },
          { text: 'Hi', link: '/ex/hi_too' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'vk', link: 'https://vk.com/jenit777' },
      { icon: 'vk', link: 'https://vk.com/club215896332' }
    ]
  }
})
