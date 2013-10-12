# Skritter HTML5

Skritter HTML5 is a partial port and adaptation of the Skritter application primary written in JavaScript. It aims to match the functionality of the current Flash and iOS versions. The code tries to maintain flexibility in the sense it can be deployed as a browser or store application without needing to alter the codebase.

## Building

**Requirements**
- Cordova 3.1+
- GruntJS
- Node.js
- (Optional) Audio files

All of the essential media files are now included in the repository. The audio files can be downloaded and placed in the `public_html/media/audio` directory, but it will greatly slow down building and testing the application. You can find this link for those at the bottom. First you'll need to install the dependencies for gruntjs. Navigate to the public_html directory and run the follow command.

	npm install
	
Next you can use grunt commands to check for errors, generate docs, compile one of the various builds. *It's important you don't delete the current cordova wrapper in the build folder because it contains special Android application settings.*

	grunt android //builds the application and attempts to run it on a connected device
	grunt docs //generates the docs in the root folder
	grunt hint //checks the application for common errors

## Troubleshooting

The application is currently using ACRA and Errorception to automatically report Android crashes and JavaScript console errors. If you'd like to further submit an issue please do so using the GitHub issues feature.

**The application is running painfully slowly.** Unfortunately devices with old Android versions, slower processors and low ram don't run canvas drawing very smoothly. It's best to be running a device with Android 4+, processor greater than a 1 GHz Cortex-A8 and at least a 1 GB RAM. If this issue only occurs after you've studied for an extend period of time then there is a leech and you can open up an issue with the details.

**The application opens but gets stuck on the loading screen.** This happens when the database is having troubles which could be for a number of reasons. A quick workaround is to make sure you have the latest build, then clear the applications cache and data.

**Grunt isn't building and pushing the application to my device.** I've only tested this on Windows, so I can't speak for any other OS. In theory, if Cordova is properly installed it should work because it has commands for multiple environments. Removing and add the Android platform will delete the customized wrapper, so if you're having troubles open an issue for it with more details. 

## Links

API Documentation: http://beta.skritter.com/api/v0/docs
Media: http://skritter.joshmcfarland.net/media.zip