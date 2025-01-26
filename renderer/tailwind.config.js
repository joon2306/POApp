const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
    },
    extend: {
      colors: {
        'purple-dashboard': "#5041BC",
        'pending-kanban': "#317195",
        'inprogress-kanban': "#28A067",
        'onhold-kanban': "#AA5E63",
        'finished-kanban': "#FD902B",
        "light-blue": "#417991",
        "low-priority": "#BAFFD6",
        "critical-priority": "#FFD5D8",
        "medium-priority": "#A2F5F0",
        "high-priority": "#FBE2FF",
        "text-low-priority": "#106633",
        "text-critical-priority": "#CC0000",
        "text-medium-priority": "#2B6662",
        "text-high-priority": "#CC00B8",
        "grey-text": "#888888",
        "title-text": "#417991"
      }
    },
  },
  plugins: [],
}
