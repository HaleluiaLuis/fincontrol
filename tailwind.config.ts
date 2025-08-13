import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    // Variantes de cores usadas dinamicamente
    'bg-green-50','bg-red-50','bg-blue-50','bg-yellow-50','bg-purple-50','bg-orange-50','bg-indigo-50',
    'text-green-600','text-red-600','text-blue-600','text-yellow-600','text-purple-600','text-orange-600','text-indigo-600',
    'bg-green-100','bg-red-100','bg-blue-100','bg-yellow-100','bg-purple-100','bg-orange-100','bg-indigo-100',
    'text-green-800','text-red-800','text-blue-800','text-yellow-800','text-purple-800','text-orange-800','text-indigo-800'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  plugins: []
};

export default config;
