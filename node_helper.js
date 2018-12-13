
const NodeHelper = require("node_helper");

//const sudo = require("sudo");

module.exports = NodeHelper.create({

    start: function function_name () {
        console.log("Starting module: " + this.name);
    },

    // Override socketNotificationReceived method.
    socketNotificationReceived: function(notification, payload) {
        console.log(this.name + " received " + notification);

        if (notification === "CONFIG") {
            this.config = payload;
            return true;
        }

        if (notification === "SCAN_NETWORK") {
            this.scanNetworkMAC();
            this.scanNetworkIP();
            return true;
        }

    },


});