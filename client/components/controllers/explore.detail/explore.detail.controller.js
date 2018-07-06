'use strict';

angular.module('rtpApp')
    .controller('ExploreDetailCtrl', function($scope, projects, $rootScope, $location, maps, $state) {
        var gmap; //Map object
        var features = []; //Holds gmap layer
        var obj, wkt; //Wkt variables
        $scope.showMap = true;
        var bounds = new google.maps.LatLngBounds();

        //Initialize map layers
        $scope.rtpLineLayer = new google.maps.Data();
        $scope.rtpPointLayer = new google.maps.Data();
        $scope.rtpPolygonLayer = new google.maps.Data();
        $scope.loadSelectedFeatures = false;

        /**
         * Load current project
         */

        var rtpId;

        //Check for rtpId in the url Parameter or in rootScope
        if ($location.search().rtpId) {
            rtpId = $location.search().rtpId;
        } else if ($rootScope.rtpId) {
            rtpId = $rootScope.rtpId;
        };

        //Set url paramter to current rtpId
        $location.search('rtpId', rtpId);
        projects.findOne(rtpId).then(response => {
            $scope.projectDetail = response.data[0];
            // console.log($scope.projectDetail.title);
        });

        $scope.backtoProjects = function() {
            $state.go('explore.data');
        }

        /**Initialize Map
         * Set Lat/Lng to San Francisco
         * Set icon/drawing defaults
         * Add tiles loaded listener to know when map is loaded
         * returns gmap object
         */
        function init(wktString) {
            console.log(wktString);
            var layer = 'toner';
            gmap = new google.maps.Map(document.getElementById('data-map-canvas'), {
                center: new google.maps.LatLng(37.796966, -122.275051),
                defaults: {
                    //icon: '/assets/images/GenericBlueStop16.png',
                    //shadow: 'dot_shadow.png',                    
                    editable: false,
                    strokeColor: '#2196f3',
                    fillColor: '#2196f3',
                    fillOpacity: 1,
                    strokeWeight: 0

                },
                disableDefaultUI: true,
                mapTypeControl: true,
                mapTypeId: layer,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT,
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    mapTypeIds: [layer, 'roadmap', 'hybrid']
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

            gmap.mapTypes.set(layer, new google.maps.StamenMapType(layer));

            google.maps.event.addListener(gmap, 'tilesloaded', function() {
                if (!this.loaded) {
                    this.loaded = true;
                    // console.log(this.loaded);
                    mapIt(wktString.wkt);
                    // NOTE: We start with a MULTIPOLYGON; these aren't easily deconstructed, so we won't set this object to be editable in this example
                    // document.getElementById('wkt').value = 'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)), ((20 35, 10 30, 10 10, 30 5, 45 20, 20 35), (30 20, 20 15, 20 25, 30 20)))';
                    // app.mapIt();
                }
            });
            // console.log(gmap);
            return gmap;
        }


        /**
         * Maps a wkt String
         * @return  {Object}    Some sort of geometry object
         */
        function mapIt(wktFeature) {
            var i;
            wkt = new Wkt.Wkt();
            // console.log($scope.featureLength);

            try { // Catch any malformed WKT strings
                wkt.read(wktFeature);
            } catch (wktFeature) {
                try {
                    wkt.read(wktFeature.replace('\n', '').replace('\r', '').replace('\t', ''));
                } catch (e2) {
                    if (e2.name === 'WKTError') {
                        alert('Wicket could not understand the WKT string you entered. Check that you have parentheses balanced, and try removing tabs and newline characters.');
                        return;
                    }
                }
            }

            obj = wkt.toObject(gmap.defaults); // Make an object


            if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {

                        // obj[i].setMap(gmap);
                        // features.push(obj[i]);

                        if (wkt.type === 'point' || wkt.type === 'multipoint')
                            bounds.extend(obj[i].getPosition());
                        else
                            obj[i].getPath().forEach(function(element, index) {
                                bounds.extend(element)
                            });
                    }
                }

                features = features.concat(obj);
            } else {
                // obj.setMap(gmap); // Add it to the map
                // features.push(obj);

                if (wkt.type === 'point' || wkt.type === 'multipoint')
                    bounds.extend(obj.getPosition());
                else
                    obj.getPath().forEach(function(element, index) {
                        bounds.extend(element)
                    });
            }

            // Pan the map to the feature
            gmap.fitBounds(bounds);
            //If single point, zoom out to scale 10
            if (wkt.type === 'point' && $scope.featureLength === 1) {
                var listener = google.maps.event.addListener(gmap, "idle", function() {
                    gmap.setZoom(16);
                    google.maps.event.removeListener(listener);
                });
            }

            /**
             * Load layers from json files
             * /assets/js/rtpLines.json, rtpPoints.json and rtpPolygons.json
             */
            //Line Layer 
            var getLineLayer = function() {

                var rtpLineLayer = new google.maps.Data();
                $.getJSON("/assets/js/rtpLines_updated.json")
                    .done(function(data) {
                        var geoJsonObject;
                        geoJsonObject = topojson.feature(data, data.objects.rtpLines_updated);
                        //Check for projects selected in data view. Otherwise load all projects
                        if ($scope.rtpIdList.length > 0) {
                            _.remove(geoJsonObject.features, function(n) {
                                // console.log(n.properties.rtpId);
                                return $scope.rtpIdList.indexOf(n.properties.rtpId) === -1;
                            });
                        }
                        console.log('length of lines');
                        console.log(geoJsonObject.features.length);
                        rtpLineLayer.addGeoJson(geoJsonObject);
                        rtpLineLayer.setStyle(function(feature) {
                            var lineAttr = feature.getProperty('system');
                            var color, strokeWeight;
                            // console.log(lineAttr);
                            if (lineAttr === 'Public Transit Facility') {
                                color = '#336699';
                                strokeWeight = 15;
                            } else {
                                color = '#d9534f';
                                strokeWeight = 15;
                            }

                            return {
                                color: 'white',
                                strokeColor: color,
                                strokeWeight: strokeWeight
                            }
                        });


                    });
                console.log(rtpLineLayer);
                return rtpLineLayer;
            }

            //Point Layer
            var getPointLayer = function() {
                var rtpPointLayer = new google.maps.Data();
                $.getJSON("/assets/js/rtpPoints.json", function(data) {

                    var geoJsonObject;
                    geoJsonObject = topojson.feature(data, data.objects.pointsRTP);
                    //Check for projects selected in data view. Otherwise load all projects
                    if ($scope.rtpIdList.length > 0) {
                        _.remove(geoJsonObject.features, function(n) {
                            // console.log(n.properties.rtpId);
                            return $scope.rtpIdList.indexOf(n.properties.rtpId) === -1;
                        });
                    }
                    rtpPointLayer.addGeoJson(geoJsonObject);
                    rtpPointLayer.setStyle(function(feature) {
                        var pointAttr = feature.getProperty('system');
                        var color;

                        if (pointAttr === 'Public Transit Facility') {
                            color = '#336699';

                        } else {
                            color = '#d9534f';

                        }

                        return {
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 15,
                                fillColor: color,
                                strokeColor: 'white',
                                strokeWeight: 1,
                                fillOpacity: 1
                            }
                        }
                    })

                });
                console.log(rtpPointLayer);
                return rtpPointLayer;
            }


            //Polygon Layer
            var getPolygonLayer = function() {
                var rtpPolygonLayer = new google.maps.Data();
                $.getJSON("/assets/js/rtpPolygons.json", function(data) {
                    var geoJsonObject;
                    console.log('in the polygon layer');
                    console.log($scope.rtpIdList);
                    // $scope.rtpIdList = [];
                    // $scope.rtpIdList.push('17-05-0027');
                    console.log($scope.rtpIdList[0]);
                    geoJsonObject = topojson.feature(data, data.objects.polysRTP);
                    //Check for projects selected in data view. Otherwise load all projects
                    if ($scope.rtpIdList.length > 0) {
                        _.remove(geoJsonObject.features, function(n) {
                            console.log(n.properties.rtpId);
                            return $scope.rtpIdList.indexOf(n.properties.rtpId) === -1;
                        });
                    }
                    console.log(geoJsonObject.features.length);
                    rtpPolygonLayer.addGeoJson(geoJsonObject);
                    rtpPolygonLayer.setStyle(function(feature) {
                        var polyAttr = feature.getProperty('system');
                        var strokeColor, strokeWeight, fillColor, fillOpacity;
                        if (polyAttr === 'Public Transit Facility') {
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
                console.log('test');
                console.log(rtpPolygonLayer);
                return rtpPolygonLayer;
            }

            //Register layers
            $scope.rtpLineLayer = getLineLayer();
            $scope.rtpPointLayer = getPointLayer();
            $scope.rtpPolygonLayer = getPolygonLayer();

            //Add layers to map
            $scope.rtpLineLayer.setMap(gmap);
            $scope.rtpPointLayer.setMap(gmap);
            $scope.rtpPolygonLayer.setMap(gmap);

            // return obj;
        }

        maps.findOne(rtpId).then(response => {
            // console.log(response.data[0]);
            $scope.rtpIdList = [response.data[0].rtpId];
            $scope.currentMapProject = response.data[0];
            $scope.featureLength = response.data.length;

            // console.log(response.data[0].wkt);

            if ($scope.featureLength) {
                for (var i in response.data) {
                    init(response.data[i]);
                }
            }
            if (!response.data[0].wkt) {
                $scope.showMap = false;
            }
        });

    });