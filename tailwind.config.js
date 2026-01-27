const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            '3xs': '390px',
            '2xs': '425px',
            xs: '475px',
            ...defaultTheme.screens,
            '3xl': '1750px',
        },
        extend: {
            colors: {
                'roofing-red': '#d22027',
                'roofing-orange': '#f26822',
                'roofing-cream': '#ead6c5',
                'roofing-cream-2': '#675143',
                'roofing-light-gray': '#f2f2f2',
                'roofing-gray': '#6a6c6e',
                'roofing-dark-gray': '#2D2D2D',
                'roofing-light-brown': '#412514',
                'roofing-dark-brown': '#3d2417',
                'roofing-teal': '#117F82',
            },
            fontSize: {
                '3xs': '.45rem',
                '2xs': '.6rem',
                '10xl': '10rem'
            },
            lineClamp: {
                7: '7',
                8: '8',
                9: '9',
                10: '10',
            },
            boxShadow: {
                card: '0 8px 40px 0 rgba(0, 0, 0, 0.1)',
                'card-focus': '0 8px 40px 6px rgba(0, 0, 0, 0.1)',
                'roofing': '0px 6px 16px 0px rgba(0,0,0,0.1), 0px 2px 0px 0px rgba(0,0,0,0.15)'
            },
            maxWidth: {
                '32': '8rem',
                '40': '10rem',
                '48': '12rem',
                '56': '14rem',
                '64': '16rem',
                '8xl': '88rem',
                '9xl': '96rem',
                '10xl': '104rem',
                '11xl': '112rem',
            },
            fontFamily: {
                'lobster': ['Lobster Two', 'cursive'],
            }
        },
    }
}
