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
app.controller('HomeCtrl', ['$scope', 'VehicleFactory', '$window', function ($scope, VehicleFactory, $window) {

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

    //before deleting the item, store in session storage for 'Undo' action
    var requestData = angular.fromJson(localStorage.getItem("item"+requestID));
    if(requestData){
      $window.sessionStorage.setItem('lastDeletedRequest', JSON.stringify(requestData) );
    }

    // Delete item from localStorage & vehicleRequests array
    localStorage.removeItem( 'item' + requestID );
    $scope.vehicleRequests.splice(index, 1);

    // we need to save / update last action performed by user in local storage for 'Undo'
    $window.sessionStorage.setItem('lastActionPerformed', JSON.stringify("Delete") );

    $window.alert("Request deleted successfully.");
    
  }

  // Unod last Request
  $scope.undoRequest = function() {

    var ActionType = angular.fromJson($window.sessionStorage.getItem("lastActionPerformed"));

    //if last action was 'Add' then we need to delete last item from localstorage & vehicleRequests Array
    if(ActionType == "Add"){

      //before deleting the item, store in session storage for 'Undo' action
      var requestData = angular.fromJson(localStorage.getItem('item' + (localStorage.length)));
      if(requestData){
        $window.sessionStorage.setItem('lastDeletedRequest', JSON.stringify(requestData) );
      }
      $window.sessionStorage.setItem('lastActionPerformed', JSON.stringify("Delete") );
      localStorage.removeItem( 'item' + (localStorage.length) );
      $scope.vehicleRequests.splice(-1,1)
    
    //if last action was 'Delete' then we need to Add last item to localstorage & vehicleRequests Array
    }else if(ActionType == "Delete"){

      var oldRequest = angular.fromJson($window.sessionStorage.getItem("lastDeletedRequest"));

      // Add Request object to localStorage as the value to a new property
      localStorage.setItem( 'item' + (localStorage.length+1), JSON.stringify(oldRequest) );
      
      //here we need to make request id again
      oldRequest["id"] = localStorage.length+1;

      //remove request from session Storage
      $window.sessionStorage.removeItem("lastDeletedRequest");
      $window.sessionStorage.setItem('lastActionPerformed', JSON.stringify("Add") );

      // Add deleted Request object to the model by adding it to the vehicleRequests array
      $scope.vehicleRequests.push( oldRequest );

     ///else do nothing
    }else{
      
    }
    
  }

}]);


///Vehicle Controller
app.controller('VehicleCtrl', ['$scope', '$location', 'VehicleFactory', '$routeParams', '$window', function ($scope, $location, VehicleFactory, $routeParams, $window) {
  
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
    $scope.requestData = angular.fromJson(requestData);

  }

   
  // Submit new Request with values from the form fields, then reset values of the fields
  $scope.addRequest= function() {   

    // If all required fields are complete 
    if( !$scope.addVehicleform.$error.required ) { 

      // Remove warning
      $scope.failed = '';

      var newRequest = {};

      // Store request data in an object         
      newRequest = $scope.requestData;
      newRequest["id"] = localStorage.length+1;

      // Add Request object to localStorage as the value to a new property
      localStorage.setItem( 'item' + (localStorage.length+1), JSON.stringify(newRequest) );

      // Add new Request object to the model by adding it to the vehicleRequests array
      $scope.vehicleRequests.push( newRequest );

      // we need to save / update last action performed by user in local storage for 'Undo'
      $window.sessionStorage.setItem('lastActionPerformed', JSON.stringify("Add") );

      // Reset the inputs values for the form
      $scope.requestData = {};
      
      $location.path('/');

    } else {
        // Add warning
        $scope.failed = 'All fields must be filled.';
    }

  };


}]);