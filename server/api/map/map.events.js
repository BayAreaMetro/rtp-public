/**
 * Map model events
 */

'use strict';

import {EventEmitter} from 'events';
var Map = require('../../sqldb').Map;
var MapEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MapEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Map.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    MapEvents.emit(event + ':' + doc._id, doc);
    MapEvents.emit(event, doc);
    done(null);
  }
}

export default MapEvents;
