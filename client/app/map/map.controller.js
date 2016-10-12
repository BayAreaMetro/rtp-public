'use strict';
(function() {

    class MapComponent {
        constructor() {
            this.message = 'Hello';
        }

        $onInit() {
            var gmap;
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
            var rtpLineLayer = new google.maps.Data();
            var rtpPointLayer = new google.maps.Data();
            var rtpPolygonLayer = new google.maps.Data();

            // console.log(rtpLineLayer);

            $.getJSON("/assets/js/rtpLines.json", function(data) {
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
                })
                rtpLineLayer.setMap(gmap);
            });

            $.getJSON("/assets/js/rtpPoints.json", function(data) {
                var geoJsonObject;
                geoJsonObject = topojson.feature(data, data.objects.rtpPoints);
                rtpPointLayer.addGeoJson(geoJsonObject);
                console.log(rtpPointLayer);

                rtpPointLayer.setMap(gmap);
            });

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
                rtpPolygonLayer.setMap(gmap);
            });

            return gmap;

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