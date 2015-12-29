//var serviceBase = 'http://demos.angularcode.com/AngularCodeUserManagerApp/services/'
var app = angular.module('myApp', ['ngRoute']);

var config = {headers:  {
        'Accept': 'application/json'
    }
};

app.factory("services", ['$http', function($http) {
  var serviceBase = 'http://localhost:3000/'
    var obj = {};
    obj.getUsers = function(){
        return $http.get(serviceBase + 'users', config);
    }
    obj.getUser = function(userID){
        return $http.get(serviceBase + 'user?id=' + userID);
    }

    obj.insertUser = function (user) {
    return $http.post(serviceBase + 'insertUser', user).then(function (results) {
        return results;
    });
	};

	obj.updateUser = function (id,user) {
	    return $http.post(serviceBase + 'updateUser', {id:id, user:user}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteUser = function (id) {
	    return $http.delete(serviceBase + 'deleteUser?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, services) {
    services.getUsers().then(function(data){
        $scope.users = data.data;
    });
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, user) {
    var userID = ($routeParams.userID) ? parseInt($routeParams.userID) : 0;
    $rootScope.title = (userID > 0) ? 'Edit User' : 'Add User';
    $scope.buttonText = (userID > 0) ? 'Update User' : 'Add New User';
      var original = user.data;
      original._id = userID;
      $scope.user = angular.copy(original);
      $scope.user._id = userID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.user);
      }

      $scope.deleteUser = function(user) {
        $location.path('/');
        if(confirm("Are you sure to delete user number: "+$scope.user._id)==true)
        services.deleteUser(user.userNumber);
      };

      $scope.saveUser = function(user) {
        $location.path('/');
        if (userID <= 0) {
            services.insertUser(user);
        }
        else {
            services.updateUser(userID, user);
        }
    };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Users',
        templateUrl: 'users.html',
        controller: 'listCtrl'
      })
      .when('/edit-user/:userID', {
        title: 'Edit Users',
        templateUrl: 'edit.html',
        controller: 'editCtrl',
        resolve: {
          user: function(services, $route){
            var userID = $route.current.params.userID;
            return services.getUser(userID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);