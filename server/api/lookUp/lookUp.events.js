/**
 * LookUp model events
 */

'use strict';

import {EventEmitter} from 'events';
var LookUp = require('../../sqldb').LookUp;
var LookUpEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LookUpEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  LookUp.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    LookUpEvents.emit(event + ':' + doc._id, doc);
    LookUpEvents.emit(event, doc);
    done(null);
  }
}

export default LookUpEvents;
