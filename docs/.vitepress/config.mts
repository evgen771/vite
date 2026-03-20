import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vite/',

  title: "Заметки",
  description: "Сделано с VitePress",

  themeConfig: {
    logo: '/icons/businessman.svg',
    nav: [
      { text: 'Домой', link: '/' },
      { text: 'Заметки', link: '/vitepress' },
    ],

    sidebar: [
      { text: 'VitePress', link: '/vitepress' },
      {
        text: 'Calculate',
        collapsed: true,
        items: [
          { text: 'About Calculate', link: '/calculate/about' },
          { text: 'Бинарность лечится...', link: '/calculate/calculate-bin' },
          { text: 'Вопрос - Ответ', link: '/calculate/calculate_ask' },
          { text: 'Команда eix', link: '/calculate/eix' },
          { text: 'Команда emerge', link: '/calculate/emerge' },
          { text: 'Цвета отображения USE-флагов', link: '/calculate/color_use_emerge' }
        ]
      },
      
      {
        text: 'Slackware',
        collapsed: true,
        items: [
          { text: 'Группы программ', link: '/slackware/categories'},
          { text: 'Markdown', link: '/markdown' },
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
