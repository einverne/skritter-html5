# Skritter HTML5

Skritter HTML5 is a partial port and adaptation of the Skritter application primary written in JavaScript while adhering to HTML5 standards. It aims to match the functionality of the current Flash and iOS versions. The code tries to maintain flexibility in the sense it can be deployed as a browser or store application without needing to alter the code-base.

## Testing

There are several browser-based environments that currently support the application, but I'd like to focus support on the ones listed below. For the time being I'd request issues are only opened for the listed environments.

**Desktop**
* Chrome 29+
* Firefox 23+
* IE 10+

**Mobile**
* Chrome 29+
* Firefox 24+

## Offline Study

Desktop and mobile browsers are making a strong push towards allowing web-apps to cache or install on devices. To test offline studying on Android install Chroma Beta (https://play.google.com/store/apps/details?id=com.chrome.beta), navigate to the website, click on the menu button and then select 'Add to homescreen'.

**Partial Support**
* Chrome Beta (Android)

**Future Support**
* Chrome (Desktop)
* Mozilla App
* Node Webkit

## Building

All of the essential media files are now included in the repository. The audio files can be downloaded and placed in the `public_html/media/audio` directory.

**Requirements**
- GruntJS
- Node.js

Before beginning to install the individual dependencies for the project you'll need to make sure that `grunt-cli` is installed globally.

	npm install -g grunt-cli

Next navigate to the root directory and run the following command to install the other dependencies. To see what will be installed to the directory look in the `package.json` file.
	
	npm install
	
After the initial install you can either run the project directly from the `public_html` directory or compile it using one of the following commands.

	grunt appcache //regenerates the cache manifest in the public_html directory
	grunt docs //generates the docs in the build directory
	grunt hint //checks the application for common errors
	grunt www-build //creates a minified version of the application in the build directory
	grunt www-copy //creates a copy non-minified version of the application in the build directory

## Troubleshooting

**The application opens but gets stuck on the loading screen.** This happens when the database is having troubles opening which could be for a number of reasons. A quick workaround is to make sure you have the latest build then try completely clearing the pages cache. Since new version are being pushed out rapidly it's always good to clear the application and cache frequently anyways.


## Links

* API Documentation: http://beta.skritter.com/api/v0/docs
* Issues: https://github.com/mcfarljw/skritter-html5/issues
* Media: http://skritter.joshmcfarland.net/media.zip