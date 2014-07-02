console.log( 'initialize Tests Initializer' );
var isTesting = true;
var tests = [];
for ( var file in window.__karma__.files) {
	if (/Test\.js$/.test( file )) {
		tests.push( file );
	}
}

var paths = {
	"angular" : "libs/angularjs/1.2.13/angular.min",
	"angularResource" : "libs/angularjs/1.2.13/angularResource.min",
	"angularRoute" : "libs/angularjs/1.2.13/angularRoute.min",
	"angularMocks" : "libs/angularjs/1.2.13/angular-mocks.min",
	"cssInjector" : "libs/angular-css-injector",
	"angularAMD" : "libs/angularAMD",
	"jQuery" : "libs/jquery-1.7.1.min",
	"initializer" : "app/initializer",
	"productListController" : "app/entries/product/productListController",
	"bootstraper" : "app/bootstraper",
	"routes" : "app/routes"
};

var dependencies = {
	// TODO: Remove this dependencies when remove Prototype
	"Prototype" : {
		deps : [ "jQuery" ]
	},
	"Informant" : {
		deps : [ "Prototype" ]
	},
	"qTip" : {
		deps : [ "jQuery" ]
	},
	"informant-ajax" : {
		deps : [ "Prototype" ]
	},
	"checkbox-element" : {
		deps : [ "Prototype" ]
	},
	"TableManager" : {
		deps : [ "Prototype" ]
	},
	"controls" : {
		deps : [ "Prototype", "effects" ]
	},
	"effects" : {
		deps : [ "Prototype" ]
	},
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
	"DatePicker" : {
		deps : [ "jQueryUI" ]
	},
	"jQueryUI" : {
		deps : [ "jQuery" ]
	},
	"Bootstrap" : {
		deps : [ "jQuery" ]
	},
	"maskedInput" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.saleView.form" : {
		deps : [ "jQuery", "TableManager" ]
	},
	"purchase.list" : {
		deps : [ "jQuery" ]
	},
	"sale.list" : {
		deps : [ "jQuery" ]
	},
	"invoice.states" : {
		deps : [ "jQuery" ]
	},
	"saleContract.list" : {
		deps : [ "jQuery" ]
	},
	"flowcontrol.printbankslip.states" : {
		deps : [ "jQuery" ]
	},
	"saleContract.menu" : {
		deps : [ "jQuery" ]
	},
	"control.analysis.analytical" : {
		deps : [ "jQuery" ]
	},
	"salecontrol.states" : {
		deps : [ 'jQuery' ]
	},
	"sale.form" : {
		deps : [ "jQuery" ]
	},
	"contaazul-components" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.certificate.form" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.company.form" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.bancolist" : {
		deps : [ "jQuery", "contaazul.apps.bankslip.popup" ]
	},
	"contaazul.apps.flowcontrol.bankaccount.states" : {
		deps : [ "jQuery", "contaazul.apps.flowcontrol.finance.states" ]
	},
	"contaazul.apps.flowcontrol.finance.states" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.bankslip.popup" : {
		deps : [ "jQuery" ]
	},
	"jquery-checkbox" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.finance.filter" : {
		deps : [ "jQuery", "contaazul.apps.finance.flow" ]
	},
	"flow" : {
		deps : [ "jQuery", "jsApi", "contaazul.apps.finance.filter", "contaazul.apps.finance" ]
	},
	"contaazul.apps.finance.category" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.finance.statement" : {
		deps : [ "jQuery" ]
	},
	"contaazul.apps.transfer.form" : {
		deps : [ "jQuery" ]
	},
	"jquery-jstree" : {
		deps : [ "jQuery" ]
	},
	"jquery-hotkeys" : {
		deps : [ "jQuery" ]
	},
	"billing" : {
		deps : [ "jQuery" ]
	},
	"jsApi" : {
		deps : [ "jQuery" ]
	},
	"DateChooserManager" : {
		deps : [ "Prototype" ]
	},
	"Contaazul" : {
		deps : [ "jQuery", "Rumblr", "Bootstrap", "maskedInput", "DatePicker", "contaazul-components",
				"informant-ajax", "Informant", "checkbox-element", "contaazul.apps.saleView.form",
				"control.analysis.analytical", "qTip", "sale.list", "invoice.states",
				"contaazul.apps.certificate.form", "contaazul.apps.company.form", "buscacep-informant",
				"mascara-informant", "reports", "reports-validation", "DateChooserManager", "contaazul.apps.bancolist",
				"contaazul.apps.flowcontrol.bankaccount.states", "contaazul.apps.flowcontrol.finance.states",
				"contaazul.apps.bankslip.popup", "jquery-checkbox", "flowcontrol.printbankslip.states",
				"salecontrol.states", "sale.form", "saleContract.menu", "saleContract.list", "controls",
				"purchase.list", "ContaAzulLoadr", "contaazul.apps.finance.category", "jquery-jstree",
				"jquery-hotkeys", "contaazul.apps.flowcontrol.bankaccount.states", "contaazul.apps.finance.statement",
				"contaazul.apps.transfer.form" ]
	},
	"Dashboard" : {
		deps : [ "Contaazul", "Loadr", "jsApi", "DatePicker", "Informant", "KendoUI" ]
	},
	"angularMocks" : {
		deps : [ "angular", "angularAMD" ]
	}
};

requirejs.config( {
	paths : paths,
	shim : dependencies,
	deps : tests,
	baseUrl : "/base",

	// start test run, once Require.js is done
	callback : window.__karma__.start
} );
