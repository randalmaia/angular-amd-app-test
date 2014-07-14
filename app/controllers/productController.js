console.log('ENTREI');
define( [ 'initializer'], function(app) {
	console.log('ENTREI2');
	console.log(app.controller);
	app.controller( 'productController', [ '$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {
			$scope.list = 5;
		} ] );
} );