const themeDir = __dirname + '/../../';
module.exports = {    
    plugins: [   
        require('postcss-import')({
            path: [themeDir]
            }), 
        require('tailwindcss')(themeDir + 'assets/tailwind/tailwind.config.js'),
        require('autoprefixer')({
            path: [themeDir]
        }),
    ]
}