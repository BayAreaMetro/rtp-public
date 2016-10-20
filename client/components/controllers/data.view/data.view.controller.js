'use strict';

angular.module('rtpApp')
    .controller('DataViewCtrl', function($scope, projects, $rootScope, $location, maps) {
        var gmap; //Map object
        var features = []; //Holds gmap layer
        var obj, wkt; //Wkt variables
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
            console.log($scope.projectDetail.title);
        })

        /**Initialize Map
         * Set Lat/Lng to San Francisco
         * Set icon/drawing defaults
         * Add tiles loaded listener to know when map is loaded
         * returns gmap object
         */
        function init(wktString) {
            gmap = new google.maps.Map(document.getElementById('data-map-canvas'), {
                center: new google.maps.LatLng(37.796966, -122.275051),
                defaults: {
                    //icon: '/assets/images/GenericBlueStop16.png',
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
                    console.log(this.loaded);
                    mapIt(wktString);
                    // NOTE: We start with a MULTIPOLYGON; these aren't easily deconstructed, so we won't set this object to be editable in this example
                    // document.getElementById('wkt').value = 'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)), ((20 35, 10 30, 10 10, 30 5, 45 20, 20 35), (30 20, 20 15, 20 25, 30 20)))';
                    // app.mapIt();
                }
            });
            console.log(gmap);
            return gmap;
        }


        /**
         * Maps a wkt String
         * @return  {Object}    Some sort of geometry object
         */
        function mapIt(wktFeature) {
            var i;
            wkt = new Wkt.Wkt();

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

            // Add listeners for overlay editing events
            // if (!Wkt.isArray(obj) && wkt.type !== 'point') {
            //     // New vertex is inserted
            //     google.maps.event.addListener(obj.getPath(), 'insert_at', function(n) {
            //         app.updateText();
            //     });
            //     // Existing vertex is removed (insertion is undone)
            //     google.maps.event.addListener(obj.getPath(), 'remove_at', function(n) {
            //         app.updateText();
            //     });
            //     // Existing vertex is moved (set elsewhere)
            //     google.maps.event.addListener(obj.getPath(), 'set_at', function(n) {
            //         app.updateText();
            //     });
            // } else {
            //     if (obj.setEditable) {
            //         obj.setEditable(false);
            //     }
            // }

            var bounds = new google.maps.LatLngBounds();

            if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
                        obj[i].setMap(gmap);
                        features.push(obj[i]);

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
                obj.setMap(gmap); // Add it to the map
                features.push(obj);

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
            if (wkt.type === 'point') {
                var listener = google.maps.event.addListener(gmap, "idle", function() {
                    gmap.setZoom(16);
                    google.maps.event.removeListener(listener);
                });
            }

            // return obj;
        }

        maps.findOne(rtpId).then(response => {
            console.log(response.data[0]);
            $scope.currentMapProject = response.data[0];
            var wktString = response.data[0].wkt;
            console.log(response.data[0].wkt);
            init(wktString);
        });

    });