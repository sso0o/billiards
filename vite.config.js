import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const navHtml = readFileSync(new URL('./src/nav.html', import.meta.url), 'utf-8').trim();

function injectNav() {
    return {
        name: 'inject-nav',
        transformIndexHtml(html) {
            return html.replace('<!--NAV-->', navHtml);
        },
    };
}

export default defineConfig({
    // base: '/billiards/',
    plugins: [injectNav()],
    build: {
        rollupOptions: {
            input: {
                index: 'index.html',
                about: 'about.html',
                contact: 'contact.html',
                faq: 'faq.html',
                guide: 'guide.html',
                privacy: 'privacy.html',
            },
        },
    },
});