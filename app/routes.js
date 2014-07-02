var dependencies = [ 'initializer', 'angularAMD', 'angular', 'angularRoute' ];
define( dependencies, function(app, angularAMD) {
	var routes = app.config( [ '$routeProvider', function($routeProvider) {
	
		$routeProvider.when( '/visao-geral', angularAMD.route( {
			templateUrl : 'app/views/productView.html',
			controller : 'productController',
			controllerUrl : 'app/controllers/productController.js'
		} ) ).otherwise( {
			redirectTo : '/visao-geral'
		} );

		
	} ] );
	return app;
} );
