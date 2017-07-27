# Dash-Hue-Doorbell
Hack an Amazon Dash Button to turn your Phillips Hue bulbs into a doorbell alert system for your whole home.

This application will make every Phillips Hue light in your home flash three times whenever your hacked amazon dash button is pressed, making for a visual notification of a visitor, rather than a solely audible one.

Video I posted about it to Facebook: https://www.facebook.com/nomdannom/videos/10154494614587024/

## How to install
Clone this repo

Run `npm install` in the root of the repo

Open the file in the root directory called `keys.json.sample`

Change the extension from `.json.sample` to `.json`. 

Note: The default location will be the root of your project. Git will ignore your `keys.json` file when committing according the an exclusion I've added to the `.gitignore`. Once you edit the ext. of the file and customize it, it will be safe from committing in the root of your project directory. 

Follow instructions below for populating the keyfile with your credentials from Hue, Dash and Twilio

## Gettin Amazon Dash Button Info
Get total control over any Dash Button by following the instructions here: 
https://www.npmjs.com/package/node-dash-button
Follow this until you get the IP and MAC address of your button

### Critical Step
Once you get your device MAC address place it in your keyfile
Once you get your device IP address, place it in your keyfile

## Setting Up Phillips Hue
This application uses a third party API for Phillips Hue. 
https://github.com/peter-murray/node-hue-api
Follow these instructions until you have a user account created and your REST API access is functional

You will need to register a user with your Hue bridge in order to access the API.
Follow the instructions for doing that here: https://developers.meethue.com/documentation/getting-started

Once you have a user name, add it to your keyfile 

## Setting up Twilio SMS
Signup for an account at Twilio.com
Add your `accountSid` and `authToken` to your keyfile.

### Critical Steps
Look for all `keys` variables referenced in `app.js` and replace each with the correct key from your keyfile.

## Bringing it Together
The most important steps are marked above as critical. 
If you get all of this information and enter it into `app.js` before running, you should be all set.

Finally, you need to run as super user.
`sudo npm start`
