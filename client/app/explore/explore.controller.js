'use strict';
(function() {

    class ExploreComponent {
        constructor(lookUp, $state, projects) {
            this.lookUp = lookUp;
            this.$state = $state;
            this.projects = projects;

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

        searchProjects(type) {
            console.log(this.county);
            console.log(this.mode);
            console.log(this.rtpId);
            console.log(this.sponsor);

            var paramsList = [];
            if (this.county)
                paramsList.push({
                    'county': this.county.county
                });

            if (this.mode)
                paramsList.push({
                    'mode': this.mode.mode
                });

            if (this.sponsor)
                paramsList.push({
                    'agency': this.sponsor.agency
                });

            if (this.rtpId)
                paramsList.push({
                    'rtpId': this.rtpId.rtpId
                });

            console.log(paramsList);
            this.projects.search(paramsList)
                .then(response => {
                    // console.log(response.data);
                    this.projects.setSearchList(response.data);


                    //Remove unnecessary fields (lodash)
                    var exportList = _.map(response.data, function(o) {
                        return _.pick(o, 'rtpId');
                    });
                    // console.log(exportList);
                    var rtpIdArray = [];
                    exportList.forEach(function(element) {
                        rtpIdArray.push(element.rtpId);
                    }, this);
                    // console.log(rtpIdArray);
                    this.projects.setViewOnMap(rtpIdArray);
                    this.$state.go(type);
                })
                .catch(function(err) {
                    console.log(err);
                });



        }

        clearSearch() {
            this.county = null;
            this.mode = null;
            this.rtpId = null;
            this.sponsor = null;
        }

    }

    angular.module('rtpApp')
        .component('explore', {
            templateUrl: 'app/explore/explore.html',
            controller: ExploreComponent
        });

})();