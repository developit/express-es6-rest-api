/**
 * User model events
 */

"use strict";
var events = require("events");
var EventEmitter = events.EventEmitter;
var User = require("./user.model");
var UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
var modelEvents = {
	save: "save",
	remove: "remove"
};

// Register the event emitter to the model events
for (var e in modelEvents) {
	var event = modelEvents[e];
	User.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
	return function(doc) {
		UserEvents.emit(event + ":" + doc._id, doc);
		UserEvents.emit(event, doc);
	};
}

module.exports = UserEvents;
