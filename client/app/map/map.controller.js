'use strict';
(function() {

    class MapComponent {
        constructor(projects) {
            var gmap;
            this.projects = projects;
            //Initialize map layers
            this.rtpLineLayer = new google.maps.Data();
            this.rtpPointLayer = new google.maps.Data();
            this.rtpPolygonLayer = new google.maps.Data();
            this.loadSelectedFeatures = false;
            this.showTools = false;

            // Load google charts
            // Load the Visualization API and the corechart package.
            google.charts.load('current', { 'packages': ['corechart'] });

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



            //Initialize legend object. Holds values for display in legend div
            this.legend = {};

            var infowindow = new google.maps.InfoWindow();

            /**
             * iniMap function
             * initializes gmap defaults
             * loads initial map layers
             * returns @gmap object
             */
            this.initMap = function() {
                var rtpIdList = this.rtpIdList;
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
                    scrollwheel: false,
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


                //GOOGLE SEARCH
                var wrappedQueryResult = document.getElementById('pac-input');

                // Create the search box and link it to the UI element.
                var searchBox = new google.maps.places.SearchBox(wrappedQueryResult);
                // gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(wrappedQueryResult);

                // Bias the SearchBox results towards current map's viewport.
                gmap.addListener('bounds_changed', function() {
                    searchBox.setBounds(gmap.getBounds());
                });

                var markers = [];
                // Listen for the event fired when the user selects a prediction and retrieve
                // more details for that place.
                searchBox.addListener('places_changed', function() {
                    var places = searchBox.getPlaces();
                    // //console.log(places);

                    if (places.length === 0) {
                        return;
                    }

                    // Clear out the old markers.
                    markers.forEach(function(marker) {
                        marker.setMap(null);
                    });
                    markers = [];

                    // For each place, get the icon, name and location.
                    var bounds = new google.maps.LatLngBounds();
                    places.forEach(function(place) {
                        var icon = {
                            url: place.icon,
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(25, 25)
                        };

                        // Create a marker for each place.
                        markers.push(new google.maps.Marker({
                            map: gmap,
                            icon: icon,
                            title: place.name,
                            position: place.geometry.location
                        }));

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    gmap.fitBounds(bounds);
                });
                //END GOOGLE SEARCH

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
                                    color: 'white',
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
                                        strokeColor: 'white',
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


                    var contentString = '<div>' +
                        '<table class="table">' +
                        '<thead style="background-color:blue;color:white;">' +
                        '<h5>' + event.feature.getProperty('title') + '</h5>' +
                        '  </thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' +
                        'Agency:' +
                        '</td>' +
                        '<td>' +
                        event.feature.getProperty('agency') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>' +
                        'County: ' +
                        '</td>' +
                        '<td>' +
                        event.feature.getProperty('county') +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '<div id="chart_div"></div>';


                    var position = {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    };
                    console.log(position);
                    infowindow.setPosition(position);
                    infowindow.setContent(contentString);
                    infowindow.open(gmap);

                    function drawChart(event) {
                        console.log(event);
                        console.log(event.feature.getProperty('committedFundingYOE'));
                        console.log(event.feature.getProperty('totalCostYOE'));
                        // Create the data table.
                        var data = new google.visualization.DataTable();
                        data.addColumn('string', 'Type');
                        data.addColumn('number', 'Total ($ millions)');
                        data.addRows([
                            ['Committed', 25],
                            ['Total Cost', 162],

                        ]);

                        // Set chart options
                        var options = {
                            'title': 'Total vs. Committed Funding',
                            'width': 350,
                            'height': 200
                        };

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                        chart.draw(data, options);
                    }
                    drawChart(event);
                });

                this.rtpPointLayer.addListener('click', function(event) {
                    console.log(event);

                    var contentString = '<div>' +
                        '<table class="table">' +
                        '<thead style="background-color:blue;color:white;">' +
                        '<h5>' + event.feature.getProperty('title') + '</h5>' +
                        '  </thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' +
                        'Agency:' +
                        '</td>' +
                        '<td>' +
                        event.feature.getProperty('agency') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>' +
                        'County: ' +
                        '</td>' +
                        '<td>' +
                        event.feature.getProperty('county') +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '<div id="chart_div"></div>';
                    var position = {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    };
                    console.log(position);
                    infowindow.setPosition(position);
                    infowindow.setContent(contentString);
                    infowindow.open(gmap);

                    function drawChart(event) {
                        console.log(event);
                        console.log(event.feature.getProperty('committedFundingYOE'));
                        console.log(event.feature.getProperty('totalCostYOE'));
                        // Create the data table.
                        var data = new google.visualization.DataTable();
                        data.addColumn('string', 'Type');
                        data.addColumn('number', 'Total ($ millions)');
                        data.addRows([
                            ['Committed', 25],
                            ['Total Cost', 162],

                        ]);

                        // Set chart options
                        var options = {
                            'title': 'Total vs. Committed Funding',
                            'width': 350,
                            'height': 200
                        };

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                        chart.draw(data, options);
                    }
                    drawChart(event);
                });

                this.rtpPolygonLayer.addListener('click', function(event) {
                    console.log(event);

                    var contentString = '<div>' +
                        '<table class="table">' +
                        '<thead style="background-color:blue;color:white;">' +
                        '<h5>' + event.feature.getProperty('title') + '</h5>' +
                        '  </thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' +
                        'Agency:' +
                        '</td>' +
                        '<td>' +
                        event.feature.getProperty('agency') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>' +
                        'County: ' +
                        '</td>' +
                        '<td>' +
                        event.feature.getProperty('county') +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '<div id="chart_div"></div>';

                    var position = {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    };
                    console.log(position);
                    infowindow.setPosition(position);
                    infowindow.setContent(contentString);
                    infowindow.open(gmap);

                    function drawChart(event) {
                        console.log(event);
                        console.log(event.feature.getProperty('committedFundingYOE'));
                        console.log(event.feature.getProperty('totalCostYOE'));
                        // Create the data table.
                        var data = new google.visualization.DataTable();
                        data.addColumn('string', 'Type');
                        data.addColumn('number', 'Total ($ millions)');
                        data.addRows([
                            ['Committed', 25],
                            ['Total Cost', 162],

                        ]);

                        // Set chart options
                        var options = {
                            'title': 'Total vs. Committed Funding',
                            'width': 350,
                            'height': 200
                        };

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                        chart.draw(data, options);
                    }
                    drawChart(event);
                });
                //End Infowindows

                //Add layers to map
                this.rtpLineLayer.setMap(gmap);
                this.rtpPointLayer.setMap(gmap);
                this.rtpPolygonLayer.setMap(gmap);

                // Add Legend
                // var centerControlDiv = document.getElementById('legend');
                // // var centerControl = new CenterControl(centerControlDiv, gmap);
                // gmap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);

                // // Add Layer Toggle
                // var toggleLayerDiv = document.getElementById('toggleLayerDiv');
                // gmap.controls[google.maps.ControlPosition.LEFT_CENTER].push(toggleLayerDiv);

                // // Add Layer Toggle
                // var toggleTools = document.getElementById('toggleTools');
                // gmap.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleTools);




                //Register map object
                this.gmap = gmap;
                return this.gmap;
            }
        }

        /**
         * On page initialization, load default map
         */
        $onInit() {
            this.initMap();


            /*====================================
                        SIDE MENU SCRIPTS BELOW 
                    ======================================*/


            // showRightPush.onclick = function() {
            //     classie.toggle(this, 'active');
            //     classie.toggle(body, 'cbp-spmenu-push-toleft');
            //     classie.toggle(menuRight, 'cbp-spmenu-open');
            //     disableOther('showRightPush');
            // };


        }

        showTools2() {
                var menuLeft = document.getElementById('cbp-spmenu-s1'),
                    menuRight = document.getElementById('cbp-spmenu-s2'),
                    showLeftPush = document.getElementById('showLeftPush'),
                    // showRightPush = document.getElementById('showRightPush'),
                    body = document.body;

                if (this.showTools) {
                    this.showTools = false;
                } else if (!this.showTools) {
                    this.showTools = true;
                }
                console.log(this.showTools);
                classie.toggle(showLeftPush, 'active');
                classie.toggle(body, 'cbp-spmenu-push-toright');
                classie.toggle(menuLeft, 'cbp-spmenu-open');
                disableOther('showLeftPush');

                function disableOther(button) {

                    if (button !== 'showLeftPush') {
                        classie.toggle(showLeftPush, 'disabled');
                    }
                    // if (button !== 'showRightPush') {
                    //     classie.toggle(showRightPush, 'disabled');
                    // }
                }


            }
            /**
             * Toggle layers function for RTP layers
             * @params layerName (name of layer being turned on/off)
             * @params feature (feature type. point, poly or line)
             */
        rtpLayerToggle(layerName, feature) {
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

        }

        /**
         * Toggle layers function for overlays
         * @params layerName (name of layer being turned on/off)
         *
         */
        loadOverlays(layerName) {
            switch (layerName) {
                case this.pdaLayer:
                    if (!layerName && this.pdasCheckbox === 1) {
                        var getPDALayer = function() {
                            var pdaLayer = new google.maps.Data();
                            $.getJSON("/assets/js/pdas.json", function(data) {
                                var geoJsonObject;
                                geoJsonObject = topojson.feature(data, data.objects.pdas);
                                pdaLayer.addGeoJson(geoJsonObject);
                                pdaLayer.setStyle(function(feature) {

                                    return {
                                        fillColor: 'orange',
                                        strokeColor: 'orange',
                                        fillOpacity: 0.2,
                                        strokeWeight: 2
                                    }
                                })

                            });
                            return pdaLayer;
                        }

                        this.pdaLayer = getPDALayer();
                        this.pdaLayer.setMap(this.gmap);
                        this.legend.pdas = 1;
                    } else if (layerName && this.pdasCheckbox === 0) {
                        this.pdaLayer.setMap();
                        this.legend.pdas = false;
                    } else if (layerName && this.pdasCheckbox === 1) {
                        this.pdaLayer.setMap(this.gmap);
                        this.legend.pdas = 1;
                    }
                    break;

                default:
                    break;
            }
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