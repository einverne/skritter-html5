# Skritter HTML5

Skritter HTML5 is a partial port and adaptation of the Skritter application primary written in JavaScript. It aims to match the functionality of the current Flash and iOS versions. The code tries to maintain flexibility in the sense it can be deployed as a browser or store application without needing to alter the codebase.

## Building

**Requirements**
- Cordova 3.0+
- Media folder
- Node.js

The repository is structured like a standard Cordova project. The www directory can be copied directly to web server to test the web-application and can be built using the Cordova command line to test the Android flavor. I have excluded the media files (audio and strokes) from the repository as they are rather bulky. They can be downloaded and copied into the proper folder using the link provided below.

## Troubleshooting

The application is currently using ACRA and Errorception to automatically report Android crashes and JavaScript console errors. If you'd like to further submit an issue please do so using the GitHub issues feature.

**The application is running painfully slowly.** Unfortunately devices with old Android versions, slower processors and low ram don't run canvas drawing very smoothly. It's best to be running a device with Android 4+, processor greater than a 1 GHz Cortex-A8 and at least a 1 GB RAM. If this issue only occurs after you've studied for an extend period of time then there is a leech and you can open up an issue with the details.

**The application opens but gets stuck on the loading screen.** This happens when the database is having troubles which could be for a number of reasons. A quick workaround is to make sure you have the latest build, then clear the applications cache and data.

## Links

API Documentation: http://beta.skritter.com/api/v0/docs
Media: http://skritter.joshmcfarland.net/media.zip