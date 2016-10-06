'use strict';
(function() {

    class DataComponent {
        constructor(projects) {
            this.message = 'Hello';
            this.projects = projects
        }

        $onInit() {
            this.projects.findAll().then(response => {
                this.projectList = response.data;

            });
        }
    }

    angular.module('rtpApp')
        .component('data', {
            templateUrl: 'app/data/data.html',
            controller: DataComponent
        });

})();