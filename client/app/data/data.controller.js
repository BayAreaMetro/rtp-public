'use strict';
(function() {

    class DataComponent {
        constructor(projects, $rootScope, $state, $location, lookUp) {
                this.message = 'Hello';
                this.projects = projects;
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.$location = $location;
                this.lookUp = lookUp;
            }
            /**
             * onInit = Page Initialization
             * Loads all projects
             * Loads a list of rtpIds
             * Loads a list of modes
             * Loads a list of sponsors
             * Loads a list of counties
             */
        $onInit() {
            this.projects.findAll().then(response => {
                this.projectList = response.data;
            }).catch(error => {
                console.log(error);
            });

            this.lookUp.rtpIds().then(response => {
                    this.rtpIdsList = response.data;
                })
                .catch(error => {
                    console.log(error);
                })

            this.lookUp.counties().then(response => {
                    this.countiesList = response.data;
                })
                .catch(error => {
                    console.log(error);
                })

            this.lookUp.modes().then(response => {
                    this.modeList = response.data;
                })
                .catch(error => {
                    console.log(error);
                })

            this.lookUp.sponsors().then(response => {
                    this.sponsorList = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        }

        /**
         * Sets project RTPId and swiches state to view state
         * @param rtpId
         */
        loadDataMap(rtpId) {
            console.log(rtpId);
            this.$rootScope.rtpId = rtpId;
            this.$state.go('data.view');

        }

        /**
         * Resets all filter/search fields
         */
        clearFilters() {
            this.search = {};
        }
    }

    angular.module('rtpApp')
        .component('data', {
            templateUrl: 'app/data/data.html',
            controller: DataComponent
        });

})();