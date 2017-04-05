'use strict';
(function() {

    class ExploreComponent {
        constructor(lookUp, $state, projects) {
            this.lookUp = lookUp;
            this.$state = $state;
            this.projects = projects;
            this.noresults = false;

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
                    console.log(this.rtpIdsList);
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

                if (this.title)
                    paramsList.push({
                        'title': this.title
                    });

                if (this.rtpId)
                    paramsList.push({
                        'rtpId': this.rtpId
                    });

                console.log(paramsList);
                this.projects.search(paramsList)
                    .then(response => {
                        if (response.data.length > 0) {
                            //Hide no results notification
                            this.noResults = false;

                            //Set project search list
                            this.projects.setSearchList(response.data);
                            console.log(response.data[0]);
                            //Check to see whether any projects can be mapped
                            var isMapped = _.find(response.data, { 'mapStatus': 'Mapped' });
                            var isMappable;
                            if (!isMapped) {
                                isMappable = false;
                            } else if (isMapped) {
                                isMappable = true;
                            }
                            console.log(isMappable, ': means there is a mapped value if true');

                            //Limit array to just RTPIds
                            var exportList = _.map(response.data, function(o) {
                                return _.pick(o, 'rtpId');
                            });

                            //Populate array of RTPIds
                            var rtpIdArray = [];
                            exportList.forEach(function(element) {
                                rtpIdArray.push(element.rtpId);
                            }, this);

                            //Set map view based on rtpId list, and switch page state
                            this.projects.setViewOnMap(rtpIdArray, isMappable);
                            console.log(rtpIdArray);
                            this.$state.go(type);
                        } else {
                            //Show no results alert
                            this.noResults = true;
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });



            }
            /* Clears all inputs in search form */
        clearSearch() {
            this.county = null;
            this.mode = null;
            this.rtpId = null;
            this.sponsor = null;
            this.title = null;
        }

    }

    angular.module('rtpApp')
        .component('explore', {
            templateUrl: 'app/explore/explore.html',
            controller: ExploreComponent
        });

})();