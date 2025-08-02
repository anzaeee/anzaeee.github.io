// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  base: '', // This must be empty if you're deploying to root domain
};
