// Hue API things
var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;
var debug = require('debug')('app.js')
var lightState = hue.lightState;

// Dash Button Hack
var dash_button = require('node-dash-button');
var dash = dash_button('44:65:0d:eb:2b:cb', null, 1000, 'all');

// Cron jobs
var cron = require('node-cron');

//**********************
// Hue API Configuration
//**********************
// Display bridges
var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

// API Configuration
var host = "192.168.1.2",
	username = "VfdIggqIZncIfPviMtu43mszKZTRG2fsk8jZkfyT",
	api,
	state = lightState.create()
	
api = new HueApi(host, username);

// Convenince Print Method
var displayResult = function(result) {
	console.log(JSON.stringify(result, null, 2));
};

var lightArray
api.lights(function(err, lights) {
	if (err) throw err;
	lightArray = lights.lights
	debug("Registering array from bridge");
	//displayResult(lights);// Uncomment to see raw light object array
});

//**************************
// Dash Button Configuration
//**************************
dash.on("detected", function (){
	console.log("dash button pressed");
	triggerDoorBell()
});

// Main trigger function upon dash button press detection
function triggerDoorBell(){
	debug("trigger door bell");
	
	// Tracking vars
	var executionTimes = 0
	var triggered = false
	
	// Cron job to dispatch on/off tasks every second
	var task = cron.schedule('* * * * * *', function(){
		debug("cron job fired");
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
				return
			}
		}
	}, true);
}


// Turn off each light in the light array
function turnOffAllLights(){
	debug("turn off all lights");
	for(var i=0; i < lightArray.length; i++){
		var lightID = lightArray[i].id
		console.log(lightID)
		api.setLightState(lightID, state.off(), function(err, result) {
			if (err) throw err;
			displayResult(result);
		});
	}
}

// Turn on each light in the light array
function turnOnAllLights(){
	debug("turn on all lights");
	for(var i=0; i < lightArray.length; i++){
		var lightID = lightArray[i].id
		console.log(lightID)
		api.setLightState(lightID, state.on(), function(err, result) {
			if (err) throw err;
			displayResult(result);
		});
	}
}