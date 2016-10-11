'use strict';
(function(){

class ExploreComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('rtpApp')
  .component('explore', {
    templateUrl: 'app/explore/explore.html',
    controller: ExploreComponent
  });

})();
