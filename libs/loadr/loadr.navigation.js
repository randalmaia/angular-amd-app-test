/*!
 * Copyright (c) 2012 Miere L. Teixeira <miere.teixeira@gmail.com>
 * This code is a refactory from original HashJS from Andreas Blixt <andreas@blixt.org>
 * release under MIT License. The refactory focus was a better methods taxonomy, targeting
 * a clean code, and make it support AMD Modules syntax. As an AMD Module it requires
 * RequireJS to be loaded into your environment.
 * 
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
define( function() {

	var documentMode = document.documentMode, history = window.history, callback = null, currentHashLocation = null, iframe = null

	/**
	 * @returns hash location without #
	 */
	function getHash() {
		var index = window.location.href.indexOf( '#' );
		return (index == -1 ? '' : window.location.href.substr( index + 1 ))
	}

	/**
	 * Dispatch callback if Hash URL has been changed
	 */
	function dispatchCallbackIfUrlChanged() {
		var curHash = getHash();
		if (curHash != currentHashLocation) {
			currentHashLocation = curHash;
			callback( curHash, false );
		}
	}

	/**
	 * Check if has <i>onhashchange</i> support
	 */
	function hasHashChangeSupport() {
		var eventName = 'onhashchange'
		var isSupported = (eventName in document.body)
		if (!isSupported) {
			document.body.setAttribute( eventName, 'return;' )
			isSupported = typeof document.body[eventName] == 'function'
		}

		return isSupported && (document.documentMode === undefined || document.documentMode > 7)
	}

	/**
	 * Create Iframe
	 */
	function createIframe() {
		var tempEl = document.createElement()
		tempEl.innerHTML = '<iframe src="javascript:void(0)" tabindex="-1" ' + 'style="display: none;"></iframe>'
		var frame = tempEl.childNodes[0]
		document.body.appendChild( frame )
		return frame
	}

	/**
	 * Set Hash as iframe content
	 */
	function setHashAsIframeContent(newHash) {
		try {
			var doc = iframe.contentWindow.document
			doc.open()
			doc.write( '<html><body>' + newHash + '</body></html>' )
			doc.close()
			currentHashLocation = newHash
		} catch (e) {
			setTimeout( function() {
				setHashAsIframeContent( newHash );
			}, 10 )
		}
	}

	/**
	 * Try to dispatch callback when hash changes
	 */
	function tryToDispatchCallbackWhenHashChanges() {
		var curData, curHash, data = currentHashLocation;

		try {
			curData = iframe.contentWindow.document.body.innerText;
			if (curData != data) {
				data = curData;
				window.location.currentHashLocation = currentHashLocation = curData;
				callback( curData, true );
			} else {
				curHash = getHash();
				if (curHash != currentHashLocation)
					setHashAsIframeContent( curHash );
			}
		} catch (e) {
		}
	}

	/**
	 * Force old Internet Explorer to dispatch callback when hash changes
	 */
	function forceInternetExplorerToDispatchCallbackWhenHashChanges() {
		try {
			iframe = createIframe()
		} catch (e) {
			setTimeout( forceInternetExplorerToDispatchCallbackWhenHashChanges, 10 )
			return;

		}

		setHashAsIframeContent( currentHashLocation )
		setInterval( tryToDispatchCallbackWhenHashChanges, 50 )
	}

	// public methods
	return {

		/**
		 * Initializes the navigation
		 * 
		 * @param newCallback:
		 *            event dispatched when hash has been changed
		 */
		initialize : function(newCallback) {
			if (callback)
				throw "Hash Navigator already initialized."

			callback = newCallback
			currentHashLocation = getHash()
			callback( currentHashLocation, true )

			if (hasHashChangeSupport()) {
				if (window.addEventListener) {
					window.addEventListener( 'hashchange', dispatchCallbackIfUrlChanged, false )
				} else if (window.attachEvent) {
					window.attachEvent( 'onhashchange', dispatchCallbackIfUrlChanged )
				}
			} else {
				if (window.ActiveXObject) {
					if (!documentMode || documentMode < 8) {
						forceInternetExplorerToDispatchCallbackWhenHashChanges()
					}
				} else {
					if (history.navigationMode) {
						history.navigationMode = 'compatible'
					}
					setInterval( dispatchCallbackIfUrlChanged, 50 )
				}
			}
		},

		/**
		 * Force navigation into URL
		 */
		navigateToURL : function(newHash) {
			if (newHash == currentHashLocation)
				return;
			if (iframe) {
				setHashAsIframeContent( newHash )
			} else {
				window.location.hash = currentHashLocation = newHash
				callback( newHash, false )
			}
		}
	}

} )
