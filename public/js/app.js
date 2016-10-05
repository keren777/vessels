
var app = angular.module('app', ['uiGmapgoogle-maps', 'ui.bootstrap']);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBDIDdFjgjQUIHL7KJp2maK32pkYdwAi6M',
        v: '3',
        libraries: 'weather,geometry,visualization'
    });
});

app.controller('appCtrl', function($scope, $http, $uibModal){
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        bounds: {},
        markersEvents: {
            click: function (marker) {

                $http.get('/vessel-info')
                    .then(function(res){
                        var vesselsInfo = res.data;
                        $scope.chosenVesselInfo = _.find(vesselsInfo, {_id: marker.key});
                        openVesselDetails();
                    });
            }
        }
    };

    $scope.markers = [];
    // Get the bounds from the map once it's loaded
    $scope.$watch(function() {
        return $scope.map.bounds;
    }, function(nv, ov) {
        // Only need to regenerate once
        if (!ov.southwest && nv.southwest) {
            var markers = [];
            $http.get('/vessel-locations')
                .then(function(res){
                    res.data.forEach(function(vessel, i){
                        var ret = {
                            id: vessel._id,
                            latitude: vessel.lastpos.geometry.coordinates[1],
                            longitude: vessel.lastpos.geometry.coordinates[0]
                        };
                        markers.push(ret);
                    });
                });
            $scope.markers = markers;
        }
    }, true);

    $scope.updateVessel = function(formData){
        var vessel = $('#vesselDataForm').serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
        }, {});

        vessel._id = $scope.chosenVesselInfo._id;
        $http.post('vessel-info', vessel)
            .then(
                function(response){
                    // success callback
                    $('.success-msg').fadeIn(500).delay(2000).fadeOut(500);
                    $scope.$dismiss();
                },
                function(response){
                    // failure callback
                    console.log('err', response);
                }
            );
    };

    $scope.biggestShip = function(){
        $scope.reset();
        $http.get('/biggest-ship')
            .then(function(res){
                var vessel = res.data;
                var index = _.findIndex($scope.markers, function(marker){
                    return marker.id == vessel._id;
                });

                $scope.markers[index].icon = '/img/big-ship.png';
                $('.queries-list').hide();
            });
    };

    $scope.inCoordinates = function(){
        $scope.reset();
        $scope.markers.forEach(function(marker){
            if(marker.longitude <= 40 && marker.longitude >= 28 && marker.latitude <= 42 && marker.latitude >= 30){
                marker.icon = '/img/ship-icon.png';
            }
        });
    };

    $scope.reset = function(){
        $scope.markers.forEach(function(el){
            if(el.icon){
                delete el.icon;
            }
        });
        $('.queries-list').hide();
    };

    var openVesselDetails = function () {
        var modalInstance = $uibModal.open({
            controller: 'appCtrl',
            scope: $scope,
            template: '<vessel-info></vessel-info>'
        });
    };

    $('#queriesBtn').on('click', function(){
        $('.queries-list').show();
    })
});