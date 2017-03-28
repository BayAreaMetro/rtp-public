'use strict';

angular.module('rtpApp')
    .controller('ExploreDataCtrl', function($scope, projects, lookUp, $filter, $state, $rootScope) {
        $scope.message = 'Hello';
        $scope.filterValues = [];
        $scope.filters = {};
        $scope.exportType = 'all';
        // $scope.selectedValues = [];

        $scope.loadDataMap = function(rtpId) {
            console.log(rtpId);
            $rootScope.rtpId = rtpId;
            $state.go('explore.detail');
        }

        if (projects.getSearchList().length > 0) {
            $scope.projectList = projects.getSearchList();
            $scope.originalProjectList = $scope.projectList;
            $scope.loaded = true;
        } else {
            $state.go('explore');
        }


        $scope.showFilters = function() {
            var menuLeft = document.getElementById('cbp-spmenu-s1'),
                menuRight = document.getElementById('cbp-spmenu-s2'),
                showLeftPush = document.getElementById('showLeftPush'),
                // showRightPush = document.getElementById('showRightPush'),
                body = document.body;

            if ($scope.showTools) {
                $scope.showTools = false;
            } else if (!$scope.showTools) {
                $scope.showTools = true;
            }
            console.log($scope.showTools);
            classie.toggle(showLeftPush, 'active');
            classie.toggle(body, 'cbp-spmenu-push-toright');
            classie.toggle(menuLeft, 'cbp-spmenu-open');
            disableOther('showLeftPush');

            function disableOther(button) {

                if (button !== 'showLeftPush') {
                    classie.toggle(showLeftPush, 'disabled');
                }

            }
        }

        $scope.changeFilter = function(key, val) {
            $scope.projectList = projects.getSearchList();
            if (key === 'clear') {
                $scope.filters = {};
            }
            $scope.projectList = $filter('filter')($scope.projectList, $scope.filters);
        }

        $scope.viewOnMap = function() {
            var exportList;
            if ($scope.exportType === 'all') {
                exportList = $scope.projectList;
            } else if ($scope.exportType === 'table') {
                exportList = $scope.selectedValues;
            } else if ($scope.exportType === 'rows') {
                exportList = $scope.selectedList;
            } else {
                exportList = $scope.projectList;
            }
            //Remove unnecessary fields (lodash)
            exportList = _.map(exportList, function(o) {
                return _.pick(o, 'rtpId');
            });
            // console.log(exportList);
            var rtpIdArray = [];
            exportList.forEach(function(element) {
                rtpIdArray.push(element.rtpId);
            }, this);
            // console.log(rtpIdArray);
            projects.setViewOnMap(rtpIdArray);
            $state.go('explore.map');
            // $scope.initMap();
        }

        $scope.checkSelected = function() {
            $scope.selectedList = [];
            $scope.exportType = 'rows';
            angular.forEach($scope.projectList, function(value, key) {
                if (value.select) {
                    this.push(value);
                }

            }, $scope.selectedList);
            console.log($scope.selectedList.length);

        }

        $scope.selectAll = function(projects) {
            console.log(projects);
            $scope.exportType = 'table';
            if (projects.select) {
                angular.forEach($scope.projectList, function(values) {
                    values.checked = 1;
                    values.select = true;
                });
            } else {
                angular.forEach($scope.projectList, function(values) {
                    values.checked = 0;
                    values.select = false;
                });
            }
            // $scope.selectedValues = $scope.projectList;
            console.log($scope.selectedValues.length);

        }

        // Browser check
        $scope.browserCheck = function msieversion() {

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


        /**
         * Converts JSON to csv string using Papa Parse (http://papaparse.com/)
         * Adds download link to DOM and names download file data.csv
         * Opens download link/csv file
         * @params this.exportType (set to 'all', 'table' or 'rows'). 
         * All will download all projects. Table will download currently filtered projects. Rows will download individually selected projects
         */
        $scope.exportCSV = function() {
            var exportList;
            var isIE = $scope.browserCheck();



            if ($scope.exportType === 'all') {
                exportList = $scope.projectList;
            } else if ($scope.exportType === 'table') {
                exportList = $scope.selectedValues;
            } else if ($scope.exportType === 'rows') {
                exportList = $scope.selectedList;
            } else {
                exportList = $scope.projectList;
            }
            //Remove unnecessary fields (lodash)
            exportList = _.map(exportList, function(o) {
                return _.omit(o, 'select', '$$hashKey', 'checked', 'projectId');
            });
            console.log(exportList);
            // var a = {
            //     name: "Foo",
            //     amount: 55,
            //     reported: false,
            //     date: "10/01/2001"
            // };

            var b = {};

            var map = {
                totalCostYOE: "How much does this project/program cost?",
                inPlanFunding: "How much of the project/program is covered in the plan period?",
                pre2017Funding: "How much of the project/program cost was included in previous plans?",
                projectOpenYr: "By when is this project anticipated to be open?",
                description: "What would this project/program do?"

            };
            exportList.forEach(function(element) {
                _.each(element, function(value, key) {
                    key = map[key] || key;
                    element[key] = value;
                });
            }, this);

            //Remove unnecessary fields (lodash)
            exportList = _.map(exportList, function(o) {
                return _.omit(o, 'totalCostYOE', 'committedFundingYOE', 'discretionaryFundingYOE', 'pre2017Funding', 'mapStatus', 'description', 'inPlanFunding', 'projectOpenYr', 'strategy2', 'investmentStrategy', 'constructionStartYr');
            });
            console.log(exportList);

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

            // Clear table of selected values
            angular.forEach($scope.projectList, function(values) {
                values.checked = 0;
                values.select = false;
            });

            window.open("data:text/csv;charset=utf-8," + encodeURI(str));
        }
    });