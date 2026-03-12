import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vite/',

  title: "Заметки",
  description: "Сделано с VitePress",

  themeConfig: {
    logo: '/icons/harry.svg'
    nav: [
      { text: 'Домой', link: '/' },
      { text: 'Заметки', link: '/markdown' },
    ],

    sidebar: [
      {
        text: 'Calculate',
        collapsed: true,
        items: [
          { text: 'About Calculate', link: '/calculate/about' },
          { text: 'Бинарность лечится...', link: '/calculate/calculate-bin' },
          { text: 'Вопрос - Ответ', link: '/calculate/calculate_ask' },
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

      outline: {
      level: [2, 3],
      label: 'На этой странице'
    },

    socialLinks: [
      { icon: 'vk', link: 'https://vk.com/jenit777' },
      { icon: 'vk', link: 'https://vk.com/club215896332' },
      { icon: 'github', link: 'https://evgen771.github.io/' }
    ]
  }
})
