var isTesting = true;
define( [ 'angularAMD', 'angularResource','cssInjector' ], function(angularAMD) {
	var app = angular.module( 'app', [ 'ngRoute', 'ngResource', 'angular.css.injector' ] );

	app.run( function($rootScope, $templateCache) {
		$rootScope.$on( '$viewContentLoaded', function() {
			$templateCache.removeAll();
		} );
	} );

	app.config( function($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|ftp|mailto|file|javascript):/ );
	} );

	return app;
} );
