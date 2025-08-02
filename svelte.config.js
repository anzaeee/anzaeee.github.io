// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      fallback: 'index.html',
      // Remove strict here — it's not a valid option for adapter-static
    }),
    paths: {
      base: '', 
    },
    prerender: {
      entries: ['*'],
    },
  },
};

export default config;
