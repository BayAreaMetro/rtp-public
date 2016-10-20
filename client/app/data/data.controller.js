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


                //Initialize map layers
                this.rtpLineLayer = new google.maps.Data();
                this.rtpPointLayer = new google.maps.Data();
                this.rtpPolygonLayer = new google.maps.Data();
                this.loadSelectedFeatures = false;

                //Initialize legend layer checkboxes
                this.rtpLineCheckbox = 1;
                this.rtpPointCheckbox = 1;
                this.rtpPolygonCheckbox = 1;

                //Check to see whether a subset of projects has been selected from data page
                if (projects.getViewOnMap()) {
                    this.rtpIdList = projects.getViewOnMap();
                    this.loadSelectedFeatures = true;
                }

                this.rtpIdList = projects.getViewOnMap();
                console.log(this.rtpIdList);


                //Initialize legend object. Holds values for display in legend div
                this.legend = {};

                var infowindow = new google.maps.InfoWindow();
                console.log(infowindow);

                this.mouseoverInfoWindow = new google.maps.InfoWindow();


                /**
                 * iniMap function
                 * initializes gmap defaults
                 * loads initial map layers
                 * returns @gmap object
                 */
                this.initMap = function() {
                    // Map Variables
                    var gmap;
                    console.log('in the map');
                    var rtpIdList = this.rtpIdList;
                    console.log(rtpIdList);
                    console.log(document.getElementById('data-canvas'));
                    gmap = new google.maps.Map(document.getElementById('data-canvas'), {
                        center: new google.maps.LatLng(37.796966, -122.275051),
                        defaults: {
                            // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                            //shadow: 'dot_shadow.png',                    
                            editable: false,
                            strokeColor: '#2196f3',
                            fillColor: '#2196f3',
                            fillOpacity: 0.6,
                            strokeWeight: 14

                        },
                        disableDefaultUI: true,
                        mapTypeControl: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControlOptions: {
                            position: google.maps.ControlPosition.TOP_LEFT,
                            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                        },
                        panControl: true,
                        streetViewControl: true,
                        scrollwheel: false,
                        zoom: 10,
                        zoomControl: true,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.LEFT_TOP,
                            style: google.maps.ZoomControlStyle.SMALL
                        }
                    });
                    console.log(gmap);
                    google.maps.event.addListener(gmap, 'tilesloaded', function() {
                        if (!this.loaded) {
                            this.loaded = true;
                            // NOTE: We start with a MULTIPOLYGON; these aren't easily deconstructed, so we won't set this object to be editable in this example

                        }
                    });



                    /**
                     * Load layers from json files
                     * /assets/js/rtpLines.json, rtpPoints.json and rtpPolygons.json
                     */
                    //Line Layer 
                    var getLineLayer = function() {

                        var rtpLineLayer = new google.maps.Data();
                        $.getJSON("/assets/js/rtpLines.json")
                            .done(function(data) {
                                var geoJsonObject;
                                geoJsonObject = topojson.feature(data, data.objects.rtpLines);
                                //Check for projects selected in data view. Otherwise load all projects
                                if (rtpIdList.length > 0) {
                                    _.remove(geoJsonObject.features, function(n) {
                                        // console.log(n.properties.rtpId);
                                        return rtpIdList.indexOf(n.properties.rtpId) === -1;
                                    });
                                }
                                rtpLineLayer.addGeoJson(geoJsonObject);
                                rtpLineLayer.setStyle(function(feature) {
                                    var lineAttr = feature.getProperty('system');
                                    var color, strokeWeight;
                                    // console.log(lineAttr);
                                    if (lineAttr === 'Public Transit') {
                                        color = '#336699';
                                        strokeWeight = 2;
                                    } else {
                                        color = '#d9534f';
                                        strokeWeight = 3;
                                    }

                                    return {
                                        color: color,
                                        strokeColor: color,
                                        strokeWeight: strokeWeight
                                    }
                                });


                            });
                        return rtpLineLayer;
                    }

                    //Point Layer
                    var getPointLayer = function() {
                            var rtpPointLayer = new google.maps.Data();
                            $.getJSON("/assets/js/rtpPoints.json", function(data) {

                                var geoJsonObject;
                                geoJsonObject = topojson.feature(data, data.objects.rtpPoints);
                                //Check for projects selected in data view. Otherwise load all projects
                                if (rtpIdList.length > 0) {
                                    _.remove(geoJsonObject.features, function(n) {
                                        // console.log(n.properties.rtpId);
                                        return rtpIdList.indexOf(n.properties.rtpId) === -1;
                                    });
                                }
                                rtpPointLayer.addGeoJson(geoJsonObject);
                                rtpPointLayer.setStyle(function(feature) {
                                    var pointAttr = feature.getProperty('system');
                                    var color;

                                    if (pointAttr === 'Public Transit') {
                                        color = '#336699';

                                    } else {
                                        color = '#d9534f';

                                    }

                                    return {
                                        icon: {
                                            path: google.maps.SymbolPath.CIRCLE,
                                            scale: 5,
                                            fillColor: color,
                                            strokeColor: 'black',
                                            strokeWeight: 1,
                                            fillOpacity: 1
                                        }
                                    }
                                })

                            });
                            return rtpPointLayer;
                        }
                        //Polygon Layer
                    var getPolygonLayer = function() {
                        var rtpPolygonLayer = new google.maps.Data();
                        $.getJSON("/assets/js/rtpPolygons.json", function(data) {
                            var geoJsonObject;
                            geoJsonObject = topojson.feature(data, data.objects.rtpPolygons);
                            //Check for projects selected in data view. Otherwise load all projects
                            if (rtpIdList.length > 0) {
                                _.remove(geoJsonObject.features, function(n) {
                                    // console.log(n.properties.rtpId);
                                    return rtpIdList.indexOf(n.properties.rtpId) === -1;
                                });
                            }
                            rtpPolygonLayer.addGeoJson(geoJsonObject);
                            rtpPolygonLayer.setStyle(function(feature) {
                                var polyAttr = feature.getProperty('system');
                                var strokeColor, strokeWeight, fillColor, fillOpacity;
                                if (polyAttr === 'Public Transit') {
                                    fillColor = '#336699';
                                    strokeColor = '#336699';
                                    strokeWeight = 2;
                                    fillOpacity = 0.2;
                                } else {
                                    fillColor = '#d9534f';
                                    strokeColor = '#d9534f';
                                    strokeWeight = 2;
                                    fillOpacity = 0.1;
                                }

                                return {
                                    fillColor: fillColor,
                                    strokeColor: strokeColor,
                                    strokeWeight: strokeWeight,
                                    fillOpacity: fillOpacity
                                }
                            })

                        });
                        return rtpPolygonLayer;
                    }


                    //Register layers
                    this.rtpLineLayer = getLineLayer();
                    this.rtpPointLayer = getPointLayer();
                    this.rtpPolygonLayer = getPolygonLayer();

                    var infowindow = new google.maps.InfoWindow;

                    //Set Layer Infowindows
                    this.rtpLineLayer.addListener('click', function(event) {
                        console.log(event);
                        var contentString = '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            '<h1 id="firstHeading" class="firstHeading">' + event.feature.getProperty('title') + '</h1>' +
                            '<div id="bodyContent">' +
                            '<p>' + event.feature.getProperty('agency') + '</p>' +
                            '<p>' + event.feature.getProperty('county') + '</p>' +
                            '</div>' +
                            '</div>';

                        var position = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        console.log(position);
                        infowindow.setPosition(position);
                        infowindow.setContent(contentString);
                        infowindow.open(gmap);
                    });

                    this.rtpPointLayer.addListener('click', function(event) {
                        console.log(event);
                        var contentString = '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            '<h1 id="firstHeading" class="firstHeading">' + event.feature.getProperty('title') + '</h1>' +
                            '<div id="bodyContent">' +
                            '<p>' + event.feature.getProperty('agency') + '</p>' +
                            '<p>' + event.feature.getProperty('county') + '</p>' +
                            '</div>' +
                            '</div>';

                        var position = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        console.log(position);
                        infowindow.setPosition(position);
                        infowindow.setContent(contentString);
                        infowindow.open(gmap);
                    });

                    this.rtpPolygonLayer.addListener('click', function(event) {
                        console.log(event);
                        var contentString = '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            '<h1 id="firstHeading" class="firstHeading">' + event.feature.getProperty('title') + '</h1>' +
                            '<div id="bodyContent">' +
                            '<p>' + event.feature.getProperty('agency') + '</p>' +
                            '<p>' + event.feature.getProperty('county') + '</p>' +
                            '</div>' +
                            '</div>';

                        var position = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        console.log(position);
                        infowindow.setPosition(position);
                        infowindow.setContent(contentString);
                        infowindow.open(gmap);
                    });
                    //End Infowindows

                    //Add layers to map
                    this.rtpLineLayer.setMap(gmap);
                    this.rtpPointLayer.setMap(gmap);
                    this.rtpPolygonLayer.setMap(gmap);

                    //Register map object
                    this.gmap = gmap;
                    return this.gmap;
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
            console.log('about to load map');
            // this.initMap();
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
            console.log(this.$scope);
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
            } else {
                exportList = this.projectList;
            }
            //Remove unnecessary fields (lodash)
            exportList = _.map(exportList, function(o) { return _.omit(o, 'select', '$$hashKey', 'checked', 'projectId'); });
            //Unparse array using Papa Parse library
            var str = Papa.unparse(exportList);
            var uri = 'data:text/csv;charset=utf-8,' + encodeURI(str);

            //Create a href link set to download csv file
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "data.csv";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            //Clear table of selected values
            angular.forEach(this.projectList, function(values) {
                values.checked = 0;
                values.select = false;
            });
            // window.open("data:text/csv;charset=utf-8," + encodeURI(str));
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
            console.log(rtpIdArray);
            this.projects.setViewOnMap(rtpIdArray);
            // this.$state.go('map');
        }

        showMapProject(project) {
            var gmap = this.gmap;
            var mouseoverInfoWindow = this.mouseoverInfoWindow;
            mouseoverInfoWindow.close();
            // console.log(project);
            // console.log(project.rtpId);
            var rtpId = project.rtpId;
            console.log(project.featureType);
            switch (project.featureType) {
                case 'LN':
                    this.rtpLineLayer.forEach(function(feature) {

                        if (feature.f.rtpId === rtpId) {
                            var geo;
                            console.log(feature.getGeometry().b[0]);
                            if (feature.getGeometry().b[0].b[0]) {
                                geo = feature.getGeometry().b[0].b[0];
                                console.log('multiline');
                            } else {
                                geo = feature.getGeometry().b[0];
                                console.log('singleline');
                            }
                            var contentString = '<div>' +
                                '<table class="table">' +
                                '<thead style="background-color:blue;color:white;">' +
                                '<h5>' + feature.f.title + '</h5>' +
                                '  </thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>' +
                                'Agency:' +
                                '</td>' +
                                '<td>' +
                                feature.f.agency +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>' +
                                'County: ' +
                                '</td>' +
                                '<td>' +
                                feature.f.county +
                                '</td>' +
                                '</tr>' +
                                '</tbody>' +
                                '</table>' +
                                '</div>';

                            var position = {
                                lat: geo.lat(),
                                lng: geo.lng()
                            };
                            console.log(position);
                            mouseoverInfoWindow.setPosition(position);
                            mouseoverInfoWindow.setContent(contentString);
                            openInfoWindow(mouseoverInfoWindow);
                        }
                    })
                    break;
                case 'PT':
                    this.rtpPointLayer.forEach(function(feature) {

                        if (feature.f.rtpId === rtpId) {
                            console.log(feature.getGeometry());
                            var geo = feature.getGeometry().b;
                            var contentString = '<div>' +
                                '<table class="table">' +
                                '<thead style="background-color:blue;color:white;">' +
                                '<h5>' + feature.f.title + '</h5>' +
                                '  </thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>' +
                                'Agency:' +
                                '</td>' +
                                '<td>' +
                                feature.f.agency +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>' +
                                'County: ' +
                                '</td>' +
                                '<td>' +
                                feature.f.county +
                                '</td>' +
                                '</tr>' +
                                '</tbody>' +
                                '</table>' +
                                '</div>';

                            var position = {
                                lat: geo.lat(),
                                lng: geo.lng()
                            };
                            console.log(position);
                            mouseoverInfoWindow.setPosition(position);
                            mouseoverInfoWindow.setContent(contentString);
                            openInfoWindow(mouseoverInfoWindow);
                        }
                    })
                    break;
                case 'PY':
                    this.rtpPolygonLayer.forEach(function(feature) {

                        if (feature.f.rtpId === rtpId) {
                            console.log(feature.getGeometry());
                            var geo = feature.getGeometry().b[0];
                            var contentString = '<div>' +
                                '<table class="table">' +
                                '<thead style="background-color:blue;color:white;">' +
                                '<h5>' + feature.f.title + '</h5>' +
                                '  </thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>' +
                                'Agency:' +
                                '</td>' +
                                '<td>' +
                                feature.f.agency +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>' +
                                'County: ' +
                                '</td>' +
                                '<td>' +
                                feature.f.county +
                                '</td>' +
                                '</tr>' +
                                '</tbody>' +
                                '</table>' +
                                '</div>';


                            var position = {
                                lat: geo.lat(),
                                lng: geo.lng()
                            };
                            console.log(position);
                            mouseoverInfoWindow.setPosition(position);
                            mouseoverInfoWindow.setContent(contentString);
                            openInfoWindow(mouseoverInfoWindow);
                        }
                    })
                    break;

                default:
                    break;
            }

            function openInfoWindow(window) {
                console.log(gmap);
                window.open(gmap);
            }
        }
    }

    angular.module('rtpApp')
        .component('data', {
            templateUrl: 'app/data/data.html',
            controller: DataComponent
        });

})();