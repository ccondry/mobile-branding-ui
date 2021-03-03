# mobile-branding-ui
A mobile website version of the dCloud CC mobile app. It is
built on Vue.js 2.6 (including vue-router and vuex), using Webpack 4.

## Development
### Usage
`yarn` to install dependency packages
`yarn start` to build libraries and start development environment with hot-reload
`yarn build:test` to build production files and start an express web server to test production files
`vue-devtools` to start Vue.js developer tools electron app. You will need to
install this tool globally and separately, but once it is available you can use
this command line to monitor state and DOM details of the Vue application. The
script for this will only be added to index.html in development mode.

## Production
### Installation
`./install.sh` to build and install to the /var/www/html/static/cloud-config folder
