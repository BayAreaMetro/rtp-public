'use strict';
(function(){

class MapComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('rtpApp')
  .component('map', {
    templateUrl: 'app/map/map.html',
    controller: MapComponent
  });

})();
