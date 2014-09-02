angular.module('app', [
	'app.user',
	 'ngRoute'
])

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/user', {
      templateUrl: 'client/user/user.html',
      controller: 'UserController'
    })
    .when('/language', {
      templateUrl: 'client/language/language.html',
      controller: 'LanguageController'
    })
    .otherwise({
      redirectTo:'/'
    })
  })

// .config(function($stateProvider, $urlRouterProvider) {
// 	$stateProvider
// 		.state('home', {
// 			url: '/',
// 			templateUrl: 'client/home/home.html',
// 			controller: 'HomeController'
// 		})
// 		.state('user', {
// 			url: '/user',
// 			templateUrl: 'client/user/user.html',
// 			controller: 'UserController'
// 		})
// 		.state('language', {
// 			url: '/language',
// 			templateUrl: 'client/language/language.html',
// 			controller: 'LanguageController'
// 		});

// 	$urlRouterProvider.otherwise('/');
// })