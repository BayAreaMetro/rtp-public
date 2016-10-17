'use strict';
(function() {

    class DataComponent {
        constructor(projects, $rootScope, $state, $location, lookUp, $filter, $scope) {
                this.message = 'Hello';
                this.projects = projects;
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.$location = $location;
                this.lookUp = lookUp;
                this.$filter = $filter;
                this.$scope = $scope;
                this.selectedValues = [];

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

        checkSelected() {
            this.selectedList = [];
            this.exportType = 'rows';
            angular.forEach(this.projectList, function(value, key) {
                if (value.select) {
                    this.push(value);
                }

            }, this.selectedList);
            console.log(this.selectedList.length);

        }

        selectAll(projects) {
            console.log(projects);
            this.exportType = 'table';
            if (projects.select) {
                angular.forEach(this.selectedValues, function(values) {
                    values.checked = 1;
                    values.select = true;
                });
            } else {
                angular.forEach(this.projectList, function(values) {
                    values.checked = 0;
                    values.select = false;
                });
            }
            // console.log(this.projectList.length);
            // console.log(this.$scope.test);
            // console.log(this.$scope);
            // console.log(selectedValues);
            // console.log(this.$scope.selectedValues);
            console.log(this.selectedValues.length);
            // console.log(this.filteredList);
            // this.exportCSV();

        }

        /**
         * Converts JSON to csv string using Papa Parse (http://papaparse.com/)
         * Adds download link to DOM and names download file data.csv
         * Opens download link/csv file
         * @params this.exportType (set to 'all', 'table' or 'rows'). 
         * All will download all projects. Table will download currently filtered projects. Rows will download individually selected projects
         */
        exportCSV() {

            var exportList;
            if (this.exportType === 'all') {
                exportList = this.projectList;
            } else if (this.exportType === 'table') {
                exportList = this.selectedValues;
            } else if (this.exportType === 'rows') {
                exportList = this.selectedList;
            }
            console.log(this.selectedList);
            var str = Papa.unparse(exportList);
            var uri = 'data:text/csv;charset=utf-8,' + encodeURI(str);

            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "data.csv";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            angular.forEach(this.projectList, function(values) {
                values.checked = 0;
                values.select = false;
            });
            // window.open("data:text/csv;charset=utf-8," + encodeURI(str));
        }
    }

    angular.module('rtpApp')
        .component('data', {
            templateUrl: 'app/data/data.html',
            controller: DataComponent
        });

})();