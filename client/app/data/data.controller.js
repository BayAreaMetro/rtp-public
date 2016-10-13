'use strict';
(function() {

    class DataComponent {
        constructor(projects, $rootScope, $state, $location) {
            this.message = 'Hello';
            this.projects = projects;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$location = $location;
        }

        $onInit() {
            this.projects.findAll().then(response => {
                this.projectList = response.data;

            });

        }

        loadDataMap(rtpId) {
            console.log(rtpId);
            this.$rootScope.rtpId = rtpId;
            this.$state.go('data.view');


        }
    }

    angular.module('rtpApp')
        .component('data', {
            templateUrl: 'app/data/data.html',
            controller: DataComponent
        });

})();