define( function() {

	var AMP = "#@#amp#@#", reAMP = new RegExp( AMP, "g" )

	// Private API

	function parseXML(xmlString) {
		xmlString = "<xml xmlns:loadr='urn:loadr'>" + xmlString.replace( /&/g, AMP ) + "</xml>"
		var myDocument = null
		if (document.implementation.createDocument) {
			var parser = new DOMParser();
			myDocument = parser.parseFromString( xmlString, "text/xml" );
		} else if (window.ActiveXObject) {
			myDocument = new ActiveXObject( "Microsoft.XMLDOM" )
			myDocument.async = "false";
			myDocument.loadXML( xmlString );
		}
		return myDocument.childNodes[0];
	}

	function convertXMLNodesToHtmlNodes(xmlNode) {
		var i, node, fragment = document.createDocumentFragment()
		for ( i = 0; i < xmlNode.childNodes.length; i++) {
			node = convertNode( xmlNode.childNodes[i] )
			if (node)
				fragment.appendChild( node )
		}
		return fragment
	}

	function convertNode(xmlNode) {
		if (xmlNode.nodeName == "parsererror" || xmlNode.nodeType == 8)
			return null
		if (xmlNode.nodeType == 3)
			return document.createTextNode( xmlNode.data.replace( reAMP, "&" ) )

		var i, convertedNode, htmlNode = document.createElement( xmlNode.nodeName )
		for ( i = 0; i < xmlNode.attributes.length; i++)
			try {
				htmlNode.setAttribute( xmlNode.attributes[i].name, xmlNode.attributes[i].value.replace( reAMP, "&" ) )
			} catch (e) {
				console.error( "Can't set node attribute: " + e )
				console.warn( htmlNode.nodeName + "." + xmlNode.attributes[i].name + "=" + xmlNode.attributes[i].value )
			}

		for ( i = 0; i < xmlNode.childNodes.length; i++) {
			try {
				convertedNode = convertNode( xmlNode.childNodes[i] )
				if (convertedNode)
					htmlNode.appendChild( convertedNode )
			} catch (e) {
				console.log( e )
			}
		}
		return htmlNode
	}

	function showNode(node) {
		if (node.style)
			node.style.display = ""
	}

	function hideNode(node) {
		if (node.style)
			node.style.display = "none"
	}

	function convertToArray(collection) {
		var i, array = new Array()
		if (collection.childNodes) {
			for ( i = 0; i < collection.childNodes.length; i++)
				array.push( collection.childNodes[i] )
			return array
		}
		for ( i = 0; i < collection.length; i++)
			array.push( collection[i] )
		return array
	}

	// Public API
	return {
		parse : function(htmlString) {
			var asXml = parseXML( htmlString )
			return convertToArray( convertXMLNodesToHtmlNodes( asXml ) )
		},

		show : function(node) {
			if (!(node instanceof Array))
				return showNode( node )

			for ( var i = 0; i < node.length; i++)
				showNode( node[i] )
		},

		hide : function(node) {
			if (!(node instanceof Array))
				return hideNode( node )

			for ( var i = 0; i < node.length; i++)
				hideNode( node[i] )
		},

		append : function(root, node) {
			if (!(node instanceof Array))
				return root.appendChild( node )

			for ( var i = 0; i < node.length; i++)
				root.appendChild( node[i] )
		},

		html : function(root, content) {
			this.removeChildren( root )
			this.append( root, content )
		},

		removeChildren : function(root) {
			while (root.hasChildNodes())
				root.removeChild( root.lastChild );
		},

		remove : function(loadrConfigTag) {
			loadrConfigTag.parentNode.removeChild( loadrConfigTag )
		},

		forEachNodeName : function(target, nodeNames, callback) {
			var i, j, k, nodes, node
			for ( i = 0; i < target.length; i++)
				nodes: for ( j = 0; j < nodeNames.length; j++) {
					if (!target[i].getElementsByTagName)
						continue nodes
					nodes = target[i].getElementsByTagName( nodeNames[j] )
					for ( k = 0; k < nodes.length; k++) {
						node = nodes[k]
						callback( node )
					}
				}
		},

		toArray : convertToArray
	}
} )
