# Skritter HTML5

Skritter HTML5 is a partial port and adaptation of the Skritter application primary written in JavaScript while adhering to HTML5 standards. It aims to match the functionality of the current Flash and iOS versions. The code tries to maintain flexibility in the sense it can be deployed as a browser or store application without needing to alter the code-base.

## Building

All of the essential media files are now included in the repository. The audio files can be downloaded and placed in the `public_html/media/audio` directory.

**Requirements**
- GruntJS
- Node.js
- (Optional) Audio files

Before beginning to install the individual dependencies for the project you'll need to make sure that `grunt-cli` is installed globally.

	npm install -g grunt-cli

Next navigate to the root directory and run the following command to install the other dependencies. To see what will be installed to the directory look in the `package.json` file.
	
	npm install
	
After the initial install you can either run the project directly from the `public_html` directory or compile it using one of the following commands.

	grunt docs //generates the docs in the build directory
	grunt cache-manifest //regenerates the cache manifest in the public_html directory
	grunt hint //checks the application for common errors
	grunt www-build //creates a minified version of the application in the build directory

## Troubleshooting

**The application opens but gets stuck on the loading screen.** This happens when the database is having troubles opening which could be for a number of reasons. A quick workaround is to make sure you have the latest build then try completely clearing the pages cache.


## Links

API Documentation: http://beta.skritter.com/api/v0/docs
Media: http://skritter.joshmcfarland.net/media.zip