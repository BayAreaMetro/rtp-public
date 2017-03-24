'use strict';
(function() {

    class DataComponent {
        constructor(projects, $rootScope, $state, $location, lookUp, $filter, $scope) {
                //    Data Variables
                this.projects = projects;
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.$location = $location;
                this.lookUp = lookUp;
                this.$filter = $filter;
                this.$scope = $scope;
                this.selectedValues = [];
                //Set download/export type to All projects
                this.exportType === 'all';
                //PreLoader
                this.loaded = false;

                // Browser check
                this.browserCheck = function msieversion() {

                    var ua = window.navigator.userAgent;
                    var msie = ua.indexOf("MSIE ");
                    var isIE;

                    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
                    {
                        // alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
                        isIE = true;
                    } else // If another browser, return 0
                    {
                        // alert('otherbrowser');
                        isIE = false
                    }

                    return isIE;
                }





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
            if (this.projects.getSearchList().length > 0) {
                this.projectList = this.projects.getSearchList();
                this.loaded = true;
            } else {
                this.projects.findAll().then(response => {
                    this.projectList = response.data;
                    this.loaded = true;
                }).catch(error => {
                    console.log(error);
                });
            }
            // this.projects.getSearchList().then(response => {
            //     this.projectList = response.data;
            //     this.loaded = true;
            // }).catch(error => {
            //     console.log(error);
            // });


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
            // console.log(rtpId);
            this.$rootScope.rtpId = rtpId;
            this.$state.go('data.view');

        }

        /**
         * Resets all filter/search fields
         */
        clearFilters() {
            // console.log(this.$scope);
            this.search = {};
            this.county = undefined;
            this.mode = undefined;
            this.sponsor = undefined;


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
            // console.log(projects);
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

            console.log(this.selectedValues.length);

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
                var isIE = this.browserCheck();

                if (this.exportType === 'all') {
                    exportList = this.projectList;
                } else if (this.exportType === 'table') {
                    exportList = this.selectedValues;
                } else if (this.exportType === 'rows') {
                    exportList = this.selectedList;
                } else {
                    exportList = this.projectList;
                }
                //Remove unnecessary fields (lodash)
                exportList = _.map(exportList, function(o) { return _.omit(o, 'select', '$$hashKey', 'checked', 'projectId'); });
                //Unparse array using Papa Parse library
                var str = Papa.unparse(exportList);
                var uri = 'data:text/csv;charset=utf-8,' + encodeURI(str);

                //Check if browser is Internet Exploer
                if (isIE) {
                    var IEwindow = window.open();
                    IEwindow.document.write('sep=,\r\n' + str);
                    IEwindow.document.close();
                    IEwindow.document.execCommand('SaveAs', true, "data.csv");
                    IEwindow.close();

                } else if (!isIE) {
                    //Create a href link set to download csv file
                    var downloadLink = document.createElement("a");
                    downloadLink.href = uri;
                    downloadLink.download = "data.csv";

                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }

                //Clear table of selected values
                angular.forEach(this.projectList, function(values) {
                    values.checked = 0;
                    values.select = false;
                });
                // window.open("data:text/csv;charset=utf-8," + encodeURI(str));
            }
            /**
             * Takes records selected in data table and sets rtpID array via a service. 
             * Then initializes map.
             */

        backToProjects() {
            console.log(this.$rootScope.dataViewSource);
            var viewSource = this.$rootScope.dataViewSource;

            if (viewSource === 'hybrid') {
                this.$state.go('hybrid');
            } else {
                this.$state.go('data');
            }
        }

        viewOnMap() {
            var exportList;
            if (this.exportType === 'all') {
                exportList = this.projectList;
            } else if (this.exportType === 'table') {
                exportList = this.selectedValues;
            } else if (this.exportType === 'rows') {
                exportList = this.selectedList;
            } else {
                exportList = this.projectList;
            }
            //Remove unnecessary fields (lodash)
            exportList = _.map(exportList, function(o) { return _.pick(o, 'rtpId'); });
            // console.log(exportList);
            var rtpIdArray = [];
            exportList.forEach(function(element) {
                rtpIdArray.push(element.rtpId);
            }, this);
            // console.log(rtpIdArray);
            this.projects.setViewOnMap(rtpIdArray);
            this.$state.go('map');
            // this.initMap();
        }


    }

    angular.module('rtpApp')
        .component('data', {
            templateUrl: 'app/data/data.html',
            controller: DataComponent
        });

})();