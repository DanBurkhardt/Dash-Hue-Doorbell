# Dash-Hue-Doorbell
Hack an Amazon Dash Button to turn your Phillips Hue bulbs into an alert system.

## How to install
Clone this repo
Run `npm install` in the root of the repo
Follow instructions below for both dash button and hue configuration

## Setting Up Amazon Dash Button
Get total control over any Dash Button by following the instructions here: 
https://www.npmjs.com/package/node-dash-button

### Critical Step
Once you get your device MAC address, enter it on line 9 of `app.js`

## Setting Up Phillips Hue
This application uses a third party API for Phillips Hue. 
Follow all instructions here: https://github.com/peter-murray/node-hue-api

### Tips: 
You will need to register a user with your Hue bridge in order to access the API.
Follow the instructions for doing that here: https://developers.meethue.com/documentation/getting-started

Once you get access to the bridge via this user, jump back over to `app.js`

### Critical Steps
Enter your bridge's IP address on line 23 of `app.js`
Enter your username that you obtained on line 24 of `app.js`

## Bringing it Together
The most important steps are marked above as critical. 
If you get all of this information and enter it into `app.js` before running, you should be all set.

Finally, you need to run as super user.
`sudo npm start`