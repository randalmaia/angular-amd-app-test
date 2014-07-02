define( [ 'bootstraper', 'angularAMD', 'angularMocks' ], function(service, angularAMD, mock) {
	'use strict';

	var $scope, $location, $rootScope, createController;

	describe( 'productController', function() {
		var $scope, $location, $rootScope, createController;

		angularAMD.inject(function ($rootScope, $controller) {
            var scope = $rootScope.$new();
            createController = $controller('productController', { $scope: scope });
        });

		it( 'should have a method to check if the path is active', function() {
			return true;
		} );
	} );

} );
