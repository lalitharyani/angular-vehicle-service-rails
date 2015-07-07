//create angular module for application
var app = angular.module( 'VehicleService', ['ngRoute'] );

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/requestform', {
            templateUrl: '/angular_views/request-form.html',
            controller: 'VehicleCtrl'
        }).
        when('/viewRequest/:requestId', {
              templateUrl: 'angular_views/request-form.html',
              controller: 'VehicleCtrl'
        }).
        otherwise({
            templateUrl: '/angular_views/home.html',
            controller: 'HomeCtrl'
        });
  }]);

//define vehicle factory 
app.factory('VehicleFactory', function () {
  return [];    // Return an array
});



///Home Controller
app.controller('HomeCtrl', ['$scope', 'VehicleFactory', function ($scope, VehicleFactory) {

  VehicleFactory = [];
  // For each item in local storage...
  for( item in localStorage ) {
    // Parse the json string and add it to VehicleFactory factory
    var newItem = angular.fromJson( localStorage[item] );
    VehicleFactory.push( newItem );
  }

  $scope.vehicleRequests = VehicleFactory;

  // Delete  Request from system
  $scope.deleteRequest = function(requestID, index) {
    // Delete item from localStorage & vehicleRequests array
    localStorage.removeItem( 'item' + requestID );
    $scope.vehicleRequests.splice(index, 1);
  }

}]);




///Vehicle Controller
app.controller('VehicleCtrl', ['$scope', '$location', 'VehicleFactory', '$routeParams', function ($scope, $location, VehicleFactory, $routeParams) {
  
  $scope.vehicleRequests = VehicleFactory;  // Array that will hold all vehicleRequests      
  $scope.failed = '';    // A message displayed if the form fails to submit

  $scope.editable = true;
  $scope.isDisabled = false;
  $scope.requestData = "";

  if($routeParams.requestId){
    $scope.editable = false;
    $scope.isDisabled = true;
    
    //get the selected request from localstorage
    var requestData = localStorage.getItem("item"+$routeParams.requestId);
    $scope.requestData = angular.fromJson(requestData)

  }

   
  // Submit new Request with values from the form fields, then reset values of the fields
  $scope.addRequest= function() {   

    // If all required fields are complete 
    if( !$scope.addVehicleform.$error.required ) { 

      // Remove warning
      $scope.failed = '';

      // Store contact data in an object         
      var newRequest = $scope.requestData;
      newRequest["id"] = localStorage.length+1;

      // Add Request object to localStorage as the value to a new property
      localStorage.setItem( 'item' + (localStorage.length+1), JSON.stringify(newRequest) );

      // Add new Request object to the model by adding it to the vehicleRequests array
      $scope.vehicleRequests.push( newRequest );

      // Reset the inputs values for the form
      $scope.requestData = {};
      
      $location.path('/');

    } else {
        // Add warning
        $scope.failed = 'All fields must be filled.';
    }

  };


}]);