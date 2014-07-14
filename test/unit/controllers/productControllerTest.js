define( [ 'bootstraper', 'angularAMD', 'angularMocks','productController' ], function(service, angularAMD, mock, controller) {
	'use strict';

	var $scope, $location, $rootScope, createController;

	describe( 'TESTE', function() {
	

		var $scope, $location, $rootScope, createController;

		
		
		angularAMD.inject(function ($rootScope, $controller) {
            var scope = $rootScope.$new();
            console.log(666);
            createController = $controller('productController', { $scope: scope });
            console.log(createController);
            console.log(scope.list);
        });

		it( 'should have a method to check if the path is active', function() {
			return true;
		} );
	} );

} );
