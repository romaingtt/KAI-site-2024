module.exports = {
	content: ["*/**/*.html"],
	theme: {
		colors: {
			'black': '#3A3335',
			'orange': '#FB3640',
			'blue': '#321EFF',
			'white': '#ffffff'
		},
		container: {
			center: true,
		},
		extend: {
			animation: {
				marquee: 'marquee 20s linear infinite',
				marquee2: 'marquee2 20s linear infinite',
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' },
				},
				marquee2: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0%)' },
				},

			},
			colors: {
				'whithish': '#FDF0D5',
				'greenish': '#3AB795'
			},
		},
	},
	variants: {},
	plugins: [
		require("@tailwindcss/typography")
	],
};
