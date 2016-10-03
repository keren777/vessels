angular.module('app')
    .directive('vesselInfo', function () {
        return {
            restrict: 'E',
            templateUrl: '../templates/vesselInfo.html'
        };
    });