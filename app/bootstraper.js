var modules = [ "angularAMD", "initializer", "routes" ];
define( 'bootstraper', modules, function(angularAMD, app) {
	
	angularAMD.bootstrap( app );
	
	return app;
} );
