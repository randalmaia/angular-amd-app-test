isTesting = false;
require( [ 'paths', 'dependencies' ], function(paths, dependencies) {
	require.config( {
		paths : paths,
		shim : dependencies,
		waitSeconds : 30,
		urlArgs : "version="
	} );
	
	require( [ 'bootstraper' ], function() {
		window.console.log( "Starting ContaAzul App" );
	} );
	
} );
