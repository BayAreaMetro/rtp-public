'use strict';
(function() {

    class MapComponent {
        constructor() {
            var gmap;
            this.message = 'Hello';
            //Initialize map layers
            this.rtpLineLayer = new google.maps.Data();
            this.rtpPointLayer = new google.maps.Data();
            this.rtpPolygonLayer = new google.maps.Data();

            //Initialize legend layer checkboxes
            this.rtpLineCheckbox = 1;
            this.rtpPointCheckbox = 1;
            this.rtpPolygonCheckbox = 1;

            /**
             * iniMap function
             * initializes gmap defaults
             * loads initial map layers
             * returns @gmap object
             */
            this.initMap = function() {
                gmap = new google.maps.Map(document.getElementById('canvas'), {
                    center: new google.maps.LatLng(37.796966, -122.275051),
                    defaults: {
                        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
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
                    zoom: 10,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP,
                        style: google.maps.ZoomControlStyle.SMALL
                    }
                });

                google.maps.event.addListener(gmap, 'tilesloaded', function() {
                    if (!this.loaded) {
                        this.loaded = true;
                        // NOTE: We start with a MULTIPOLYGON; these aren't easily deconstructed, so we won't set this object to be editable in this example

                    }
                });





                var getLineLayer = function() {
                    var rtpLineLayer = new google.maps.Data();
                    $.getJSON("/assets/js/rtpLines.json")
                        .done(function(data) {

                            var geoJsonObject;
                            geoJsonObject = topojson.feature(data, data.objects.rtpLines);
                            rtpLineLayer.addGeoJson(geoJsonObject);
                            rtpLineLayer.setStyle(function(feature) {
                                var lineAttr = feature.getProperty('system');
                                var color, strokeWeight;
                                // console.log(lineAttr);
                                if (lineAttr === 'Public Transit') {
                                    color = '#009edd';
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


                var getPointLayer = function() {
                    var rtpPointLayer = new google.maps.Data();
                    $.getJSON("/assets/js/rtpPoints.json", function(data) {

                        var geoJsonObject;
                        geoJsonObject = topojson.feature(data, data.objects.rtpPoints);
                        rtpPointLayer.addGeoJson(geoJsonObject);

                    });
                    return rtpPointLayer;
                }




                var getPolygonLayer = function() {
                    var rtpPolygonLayer = new google.maps.Data();
                    $.getJSON("/assets/js/rtpPolygons.json", function(data) {
                        var geoJsonObject;
                        geoJsonObject = topojson.feature(data, data.objects.rtpPolygons);
                        rtpPolygonLayer.addGeoJson(geoJsonObject);
                        rtpPolygonLayer.setStyle(function(feature) {
                            var polyAttr = feature.getProperty('system');
                            var color, strokeWeight;
                            // console.log(lineAttr);
                            if (polyAttr === 'Public Transit') {
                                color = '#009edd';
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
                        })

                    });
                    return rtpPolygonLayer;
                }

                //Register layers and add to map
                this.rtpLineLayer = getLineLayer();
                this.rtpLineLayer.setMap(gmap);

                this.rtpPointLayer = getPointLayer();
                this.rtpPointLayer.setMap(gmap);

                this.rtpPolygonLayer = getPolygonLayer();
                this.rtpPolygonLayer.setMap(gmap);

                //Register map object
                this.gmap = gmap;
                return this.gmap;
            }
        }
        $onInit() {
            this.initMap();

        }

        rtpLinesToggle(layerName, feature) {
            switch (feature) {
                case 'line':
                    if (this.rtpLineCheckbox === 1) {
                        layerName.setMap(this.gmap);
                    } else if (this.rtpLineCheckbox === 0) {
                        layerName.setMap();
                    }
                    break;

                case 'point':
                    if (this.rtpPointCheckbox === 1) {
                        layerName.setMap(this.gmap);
                    } else if (this.rtpPointCheckbox === 0) {
                        layerName.setMap();
                    }
                    break;

                case 'poly':
                    if (this.rtpPolygonCheckbox === 1) {
                        layerName.setMap(this.gmap);
                    } else if (this.rtpPolygonCheckbox === 0) {
                        layerName.setMap();
                    }
                    break;

                default:
                    break;
            }
            // console.log(this.rtpLineCheckbox);
            // console.log(this.gmap);


        }

        addThing() {
            if (this.newThing) {
                this.$http.post('/api/things', {
                    name: this.newThing
                });
                this.newThing = '';
            }
        }

        deleteThing(thing) {
            this.$http.delete('/api/things/' + thing._id);
        }
    }

    angular.module('rtpApp')
        .component('map', {
            templateUrl: 'app/map/map.html',
            controller: MapComponent
        });

})();