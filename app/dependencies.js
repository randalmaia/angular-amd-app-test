define( "dependencies", function() {
	return {
		"angular" : {
			"exports" : "angular",
			deps : [ "jQuery" ]
		},
		"angularRoute" : {
			deps : [ "angular" ]
		},
		"angularResource" : {
			deps : [ "angular" ]
		},
		"angularAMD" : {
			deps : [ "angular", "angularResource" ]
		},
		"cssInjector" : {
			deps : [ "angular", "angularRoute" ]
		},
		"jQuery" : {
			exports : "jQuery"
		},
	};
} );
