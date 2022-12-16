// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

const REPO_URL = 'https://github.com/zeldaret/botw';
const DISCORD_URL = 'https://discord.zelda64.dev';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Breath of the Wild Decompilation',
  tagline: 'An ongoing reverse engineering project to analyse and reimplement part of Breath of the Wild.',
  url: 'https://botw.link',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  baseUrlIssueBanner: false,

  plugins: [require.resolve('@cmfcmf/docusaurus-search-local')],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
          blogSidebarCount: 0,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Breath of the Wild Decompilation',
        logo: {
          alt: 'Breath of the Wild Decompilation',
          src: 'img/logo.png',
          height: 32,
          width: 32,
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            label: 'About',
            docId: 'about',
          },
          { to: '/progress', label: 'Progress', position: 'left' },
          {
            type: 'doc',
            position: 'left',
            label: 'Docs',
            docId: 'contribute/index',
          },
          {
            href: REPO_URL,
            label: 'GitHub',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Source code',
            items: [
              { label: 'GitHub', href: REPO_URL },
              { label: 'Website source', href: 'https://github.com/open-ead/botw-decomp-www' },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'ZeldaRET',
                href: 'https://zelda64.dev',
              },
              {
                label: 'Zelda Decompilation Discord',
                href: DISCORD_URL,
              },
            ],
          },
        ],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        darkTheme: darkCodeTheme,
        defaultLanguage: 'cpp',
      },
    }),
};

module.exports = config;
