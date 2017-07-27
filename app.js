// Read keys from local keyfile
var fs = require('fs')
var localKeyPath = "keys.json"
var keys

// Application Debugging
var debug = require('debug')('app.js')

// Read keyfile
fs.readFile(localKeyPath, handle)// Format your keyfile however you want

// Callback for keyfile
function handle(err, data) {
	if (err) throw err
	keys = JSON.parse(data)
	debug("Read local keyfile into memory..")
	// Launch after reading the keys from local dir
	launchApplication()
}


function launchApplication() {	
	debug("Application launched..")
	
	// Hue API things
	var hue = require("node-hue-api");
	var HueApi = require("node-hue-api").HueApi;
	var lightState = hue.lightState;

	// Dash Button Hack
	var dash_button = require('node-dash-button');
	var dash = dash_button(keys.dashButtonMAC, null, 1000, 'all');

	// Twilio Client
	//require the Twilio module and create a REST client
	var twilioClient = require('twilio')(keys.twilio.accountSID, keys.twilio.token); 

	// Cron jobs
	var cron = require('node-cron');

	//**********************
	// Hue API Configuration
	//**********************
	var host = keys.hue.ipAddress,
		username = keys.hue.username,
		api,
		state = lightState.create()
	
	api = new HueApi(host, username);

	var lightArray
	api.lights(function(err, lights) {
		if (err) throw err;
		lightArray = lights.lights
		debug("Obtained list of available Hue lights..");
		debug("Standing by for doorbell / dash button activation..")
		//debug(JSON.stringify(lights));// Uncomment to see raw light object array
	});

	//**************************
	// Dash Button Configuration
	//**************************
	var lastTimePressed = 0
	dash.on("detected", function (){
		/* 
		/ Sometimes the Dash Button makes multiple calls in short succession.
		/ Here I build a .5 second buffer between allowing excution to ensure
		/ it only fires on the very first of the calls.
		*/ 
		lastTimePressed = (new Date).getTime()
		if (((new Date).getTime() - lastTimePressed) < 500){
			debug("Dash button press detected..");
			triggerDoorBell()	
		}
	});

	// Main trigger function upon dash button press detection
	function triggerDoorBell(){
		debug("Doorbell function triggered..");
	
		// Tracking vars
		var executionTimes = 0
		var triggered = false
	
		// OPTIONAL
		sendSMS()// Comment this line out if you do not wish to 
	
		// Cron job to dispatch on/off tasks every second
		var task = cron.schedule('* * * * * *', function(){
			debug("Cron job for light switching fired..")
			if(triggered == false){
				turnOffAllLights()
				triggered = true
			}else{
				turnOnAllLights()
				// Reset & increment vars
				triggered = false
				executionTimes++
			
				// Stop executing after 3 times 
				if(executionTimes == 3){
					executionTimes = 0
					task.stop()
					debug("Executed three times, cron job stopped..")
					debug("Application returning to background state.\n\n")
					return
				}
			}
		}, true);
	}

	// Send Text Message
	function sendSMS(){
		debug("Sending Twilio sms message.."); 
		twilioClient.messages.create({ 
			to: keys.twilio.twilioToNumber, 
			from: keys.twilio.twilioFromNumber, 
			body: "Knock Knock! Someone is at the door right now!",   
		}, function(err, message) { 
			if(err){
				debug("Twilio Message Error: "+err)	
			}else{
				debug("Twilio sms message sent successfully..")
			}
		});
	}

	// Turn off each light in the light array
	function turnOffAllLights(){
		for(var i=0; i < lightArray.length; i++){
			var lightID = lightArray[i].id
			api.setLightState(lightID, state.off(), function(err, result) {
				if (err) throw err;
				displayResult(result);
			});
		}
	}

	// Turn on each light in the light array
	function turnOnAllLights(){
		for(var i=0; i < lightArray.length; i++){
			var lightID = lightArray[i].id
			api.setLightState(lightID, state.on(), function(err, result) {
				if (err) throw err;
				displayResult(result);
			});
		}
	}

}// End launchApplication()
