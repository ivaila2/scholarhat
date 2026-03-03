/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				// We are naming it 'claude' so it's easy for you to remember!
				claude: ['"Newsreader"', 'serif'],
			}
		},
	},
	plugins: [],
}