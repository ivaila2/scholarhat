/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				// This overrides the default font to Inter for the whole site
				sans: ['"Inter"', 'sans-serif'], 
				// Our custom serif for headings
				claude: ['"Newsreader"', 'serif'],
			}
		},
	},
	plugins: [],
}