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