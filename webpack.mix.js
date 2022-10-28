let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js/app.js').postCss("/resources/sccs/app.scss", 'public/css/app.css')