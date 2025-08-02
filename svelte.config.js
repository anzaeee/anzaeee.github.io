// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      fallback: 'index.html',
      strict: false, 
    }),
    paths: {
      base: '', // this is fine if you're deploying at root of the domain
    },
    prerender: {
      entries: ['*'],
    },
  },
};

export default config;
