var myapp = angular.module('myapp', [],function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    });

myapp.constant('config',{
        'baseUrl':'http://dhruvdutt.herokuapp.com/',
        //'baseUrl':'http://localhost:3000/',
    });

var myapp = angular.module('myapp');

myapp.controller('UserController', function($scope,$http,config) {
  $scope.users = [];
  $scope.getUsers = function(){
    $scope.users = [];
    $http.get(config.baseUrl+'users').success(
      function(response){
        $scope.users = response;
      }
    ).error(
      function(data){
        console.log(data);
      }
    )
  }

  $scope.createUser = function(data){
    $http.post(config.baseUrl+'users',data).success(
      function(response){
          console.log(response);
            $scope.getUsers();
            location.reload();
      }
    ).error(
      function(data){
        console.log(data);
      }
    )
  }
  $scope.updateUser = function(id,data){
    console.log(data.name);
    console.log(data.position);
    $http.put(config.baseUrl+'users/'+id+'/edit',data).success(
      function(response){
          $scope.getUsers();
          console.log(response);
      }
    ).error(
      function(data){
        console.log(data);
      }
    )
  }
  
  $scope.deleteUser = function(id){
    $http.delete(config.baseUrl+'users/'+id+'/edit').success(
      function(response){
          $scope.getUsers();
      }
    ).error(
      function(data){
        console.log(data);
      }
    )
  }

  $scope.logout = function(){
    window.location.href=config.baseUrl;
  }
});
