/* global Module */

/* Magic Mirror
 * Module: MMM-Time
 *
 * By Fredrik Santander   
 * MIT Licensed.
 */

Module.register("MMM-Time", {

	// Define module defaults
	defaults: {	
		timerinterval: 1000,
	},

	//
	//	OnStart-method
	//
	start: function () {
		Log.log("Starting module: " + this.name);

		this.currentMin = 20;
		this.timer_on = false;
		this.timer = 0;
		this.timerinterval = this.config.timerinterval;

	},

	// Subclass getStyles method.
	getStyles: function() {
		return ["MMM-Time.css"];
	},
	//
	// onSocketNotification
	//		- Todo: enable debug information or other info to be presented on screen
	//
	socketNotificationReceived: function (notification, payload) {
		self = this;
	},

	notificationReceived: function(notification, payload, sender) {
		if(notification == "SET_TIMETABLE") {
			this.timer_on = (payload.on == "ON");
			this.currentMin = payload.minutes;
			this.timerinterval = payload.interval ? payload.interval : this.config.timerinterval;
			console.log("SETTING TIMER");
			console.log(this.currentMin);
		}
		var self = this;
		console.log(this.config.timerinterval);
		if (this.timer_on) {
			if(this.timer) clearInterval(this.timer);
			this.timer = setInterval(function() {
				self.updateTimer(self);
			}, this.timerinterval);
		}

	},

	updateTimer(self) {
		console.log(self.currentMin);
		self.currentMin--;
		if (self.currentMin <= 0) {
			console.log("ending timer");
			self.finished = true;
			self.timer_on = false;
			clearInterval(self.timer);
			self.timer = 0;
		}
		this.updateDom();
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		var timeTable = document.createElement("table");

		timeTable.className = "timetable_wrapper";

		var currentMin = this.currentMin;
		if (this.timer_on == false) {
			currentMin = "AV";
		}

		var row = document.createElement("tr");
		var cell = document.createElement("td");
		row.appendChild(cell);
		cell.innerHTML = ("00" + currentMin).slice(-2);
		cell.className = "minute";
		timeTable.appendChild(row);

		if (this.timer_on) {
			row = document.createElement("tr");
			cell = document.createElement("td");
			row.appendChild(cell);
			timeTable.appendChild(row);
			
			var t2 = document.createElement("table");
			t2.className = "timetable";
			cell.appendChild(t2);

			for(var i=0; i<20; i++) {
				row = document.createElement("tr");
				row.className = "timerow";
				cell = document.createElement("td");
		
				row.appendChild(cell);
				cell.innerHTML = "";
				if (i<currentMin) {
					cell.className = "red";
				} else {
					cell.className = "empty";
				}
				t2.appendChild(row);
			}
		}
		wrapper.appendChild(timeTable);
		return wrapper;
	}
});
