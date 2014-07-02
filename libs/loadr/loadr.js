/*!
 * Copyright (c) 2012 Miere L. Teixeira <miere.teixeira@gmail.com>
 * UI Module loader based on Behavior Driven Development and Layering development
 * paradigms. It was developed as AMD Module. As an AMD Module it requires
 * RequireJS to be loaded into your environment.
 * 
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
define(
		[ "loadr.http", "loadr.dom", "loadr.navigation" ],
		function(http, dom, navigation) {

			var configuration = null, currentLocation = null, navigationHistory = new Array()

			/**
			 * Event dispatched when the hash navigation change
			 */
			function onHashNavigationChange(newLocation, isApplicationInitialization) {
				if (configuration.onHashNavigationChange)
					configuration.onHashNavigationChange.apply( configuration, arguments )

				if (configuration.shouldNotRenderAtInitialization && isApplicationInitialization)
					return;

				if (navigationHistory.length > 0 && navigationHistory.last().location == newLocation) {
					renderLastLocation()
					return;

				}

				loadLocationViewAndRender( newLocation, isApplicationInitialization )
			}

			/**
			 * Re-render the last rendered location
			 */
			function renderLastLocation() {
				var lastLocation = navigationHistory.last()
				configuration.historyBackTransition( currentLocation.html, lastLocation.html )
				navigationHistory.remove( lastLocation )
				currentLocation = lastLocation
			}

			/**
			 * Load location view from new hash location and render it on
			 * container.
			 */
			function loadLocationViewAndRender(newLocation, isApplicationInitialization) {
				loadView( {
					url : newLocation,
					onModuleLoad : function(args) {
						tryToRenderResponse( {
							'html' : args.html,
							'modules' : args.modules,
							'location' : newLocation,
							'isApplicationInitialization' : isApplicationInitialization
						} )
					}
				} )
			}

			/**
			 * Try do load the module from server
			 */
			function loadView(args) {
				configuration = args;
				configuration.context = '';

				http.request( {
					url : configuration.context + args.url,
					data : args.data,
					disableAntiBurst : args.disableAntiBurst,
					success : function(html, sentRequestArgs) {
						if (configuration.onFinishLoadModule)
							configuration.onFinishLoadModule.apply( configuration, arguments )

						initializeView( {
							'url' : sentRequestArgs.url,
							'html' : html,
							'onModuleLoad' : args.onModuleLoad
						} )
					},
					error : function() {
						if (configuration.onFinishLoadModule)
							configuration.onFinishLoadModule()
						onCommunctionBreakdown.apply( this, arguments )
					}
				} )
			}

			/**
			 * Initialize the view arrived from server and its modules
			 */
			function initializeView(args) {
				var html = args.html
				var urlQueryString = parseUrlQueryString( args.url )
				var viewModules = readModuleConfiguration( html, urlQueryString )

				require( viewModules.names, function() {
					var loadedData = {
						'html' : html,
						'modules' : initializeViewModules( arguments, html, viewModules ),
						'url' : args.url
					}
					if (configuration.onModuleLoaded)
						configuration.onModuleLoaded( loadedData )
					if (args.onModuleLoad)
						args.onModuleLoad( loadedData )
				} )
			}

			function parseUrlQueryString(url) {
				var i, keyValuePair, queryParams = new Object(), params = url.split( "?" )[1], params = params ? params
						.split( "&" ) : null

				if (params)
					for ( i = 0; i < params.length; i++) {
						keyValuePair = params[i].split( "=" )
						queryParams[keyValuePair[0]] = keyValuePair[1]
					}

				return queryParams
			}

			/**
			 * Initialize view modules
			 */
			function initializeViewModules(loadedModules, html, viewModules) {
				var i, module = null, modules = new Array()

				for ( i = 0; i < loadedModules.length; i++) {
					module = loadedModules[i]
					if (!module)
						continue
					if (!module.config)
						module.config = viewModules.configs[i]
					if (module.initialize)
						module.initialize.apply( module, [ html, viewModules.configs[i] ] )
					modules.push( module )
				}

				return modules
			}

			/**
			 * Read Module Configuration from HTML's DOM
			 */
			function readModuleConfiguration(html, queryStringParams) {
				var modules = {
					names : new Array(),
					configs : new Array()
				}

				dom.forEachNodeName( html, [ "loadr:config", "config" ], function(node) {
					var parsedModuleNode = parseModuleNode( node, queryStringParams )
					modules.names.push( parsedModuleNode.name )
					modules.configs.push( parsedModuleNode.attributes )
					dom.remove( node )
				} )

				return modules
			}

			/**
			 * Parse module loader node from html. Transform the bellow html
			 * sample into and JavaScript Object.
			 * 
			 * <b>Sample</b> <code>
			 * <loadr:config module="contaazul/admin/product/ProductImport" userid="1234" />
			 * </code>
			 */
			function parseModuleNode(node, queryString) {
				var attribute, attributes = new Object()

				for ( var i = 0; i < node.attributes.length; i++) {
					attribute = node.attributes[i]
					attributes[attribute.name] = attribute.value
				}

				for ( var attr in queryString)
					attributes[attr] = queryString[attr]

				return {
					name : attributes.module,
					attributes : attributes
				}
			}

			/**
			 * Event dispatched when fails to retrieve module data from server
			 */
			function onCommunctionBreakdown() {
				if (configuration.onFailToRequestModule)
					configuration.onFailToRequestModule.apply( configuration, arguments )
				else
					console.log( arguments )
			}

			/**
			 * Event dispatched when module is loaded
			 */
			function tryToRenderResponse(args) {
				if (configuration.onModuleLoad)
					configuration.onModuleLoad( args )

				if (configuration.shouldNotAutoRender)
					return;

				var html = args.html, oldHtml = currentLocation ? currentLocation.html : null

				if (configuration.shouldNotKeepHistory)
					configuration.singleViewTransition( html )
				else
					configuration.newLocationTransition( oldHtml, html )

				currentLocation = {
					location : args.location,
					html : args.html
				}
			}

			/**
			 * Render Module Keeping History
			 */
			function newLocationTransition(oldHtml, html) {
				if (currentLocation)
					navigationHistory.push( currentLocation )

				runDefaultTransitionBetweenHTML( oldHtml, html )
			}

			/**
			 * Do default transition between old HTML and new location HTML
			 */
			function runDefaultTransitionBetweenHTML(oldHtml, html) {
				if (!oldHtml)
					configuration.singleViewTransition( html )
				else
					configuration.forwardTransition( oldHtml, html )
			}

			/**
			 * Do default transition between old HTML and new location HTML
			 */
			function hideOldAndShowNewHtmlTransition(oldHtml, html) {
				dom.hide( oldHtml )
				dom.append( configuration.targetContainer, html )
				dom.show( html )
			}

			/**
			 * Render Module
			 */
			function singleViewTransition(html) {
				dom.html( configuration.targetContainer, html )
			}

			/**
			 * Read Configuration
			 */
			function readConfiguration(config) {
				configuration = config

				configuration.context = configuration.context || ""
				configuration.targetContainer = document.getElementById( configuration.targetContainer )
				configuration.shouldInitializeNavigation = (config.shouldInitializeNavigation || config.shouldInitializeNavigation == undefined)

				configuration.historyBackTransition = configuration.historyBackTransition
						|| hideOldAndShowNewHtmlTransition
				configuration.forwardTransition = configuration.forwardTransition || hideOldAndShowNewHtmlTransition
				configuration.newLocationTransition = configuration.newLocationTransition || newLocationTransition
				configuration.singleViewTransition = configuration.singleViewTransition || singleViewTransition

				configuration.shouldAutoRender = (configuration.targetContainer && configuration.targetContainer.length)
			}

			return {

				loadView : loadView,
				navigation : navigation,

				/**
				 * Initialize the module loader and the hash navigator
				 */
				initialize : function(config) {
					readConfiguration( config )

					if (configuration.shouldInitializeNavigation)
						navigation.initialize( onHashNavigationChange )
				}
			}

		} )
