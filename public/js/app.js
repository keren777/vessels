

var app = angular.module('app', ['uiGmapgoogle-maps', 'ui.bootstrap']);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBDIDdFjgjQUIHL7KJp2maK32pkYdwAi6M',
        v: '3', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

app.controller('appCtrl', function($scope, $http, $uibModal, uiGmapGoogleMapApi){



    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        zoom: 1,
        bounds: {},
        markersEvents: {
            click: function (marker, eventName, model, arguments) {

                $http.get('/vessel-info')
                    .then(function(res){
                        var vesselsInfo = res.data;
                        $scope.chosenVesselInfo = _.find(vesselsInfo, {_id: marker.key});
                        console.log(res, marker, $scope.chosenVesselInfo)

                        open($scope.chosenVesselInfo);

                    })

                console.log('Marker was clicked (' + marker + ', ' + eventName);//+', '+mydump(model, 0)+', '+mydump(arguments)+')');
            }
        }
    };

    var open = function (chosenVesselInfo) {
        var modalInstance = $uibModal.open({
            controller: 'appCtrl',
            scope: $scope,
            template: '<vessel-info></vessel-info>'
        });

        modalInstance.result.then(function(){
            // closed
        }, function(){
            // dismissed
        });
    };

    $scope.options = {
        scrollwheel: false
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
                    console.log(res);

                    res.data.forEach(function(vessel, i){
                        var ret = {
                            id: vessel._id,
                            latitude: vessel.lastpos.geometry.coordinates[0],
                            longitude: vessel.lastpos.geometry.coordinates[1],
                            title: 'm' + i
                        };

                        markers.push(ret, $scope.map.bounds);
                    })
                });
                $scope.markers = markers;
        }
    }, true);


    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {

    });
})