/*
 * Just a simple and single async request poll.
 */
define( [ "loadr.dom" ], function(dom) {

	function newHttpRequest() {
		try {
			return new XMLHttpRequest();
		} catch (e) {
			try {
				return new ActiveXObject( "Msxml2.XMLHTTP" )
			} catch (e) {
				return new ActiveXObject( "Microsoft.XMLHTTP" )
			}
		}
	}

	function doRequest(args) {
		var request = newHttpRequest()
		request.open( args.type, args.url, true )
		request.onreadystatechange = function() {
			if (request.readyState != 4)
				return;
			var isSuccess = request.status >= 200 && request.status < 300;
			if (isSuccess && args.success) {
				var parsedDom = dom.parse( request.responseText );
				args.success( parsedDom, args )
			}
			if (!isSuccess && args.error)
				args.error( request, args )
		}
		var data = prepareDataAndHttpHeaderBeforeSend( request, args.data )
		request.send( data )
	}

	function prepareDataAndHttpHeaderBeforeSend(request, data) {
		if (data instanceof String)
			return data

		var buffer = ""
		for ( var attr in data) {
			if (buffer)
				buffer += "&"
			buffer += attr + "=" + encodeURIComponent( data[attr] )
		}

		request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );

		return buffer
	}

	return {
		request : function(args) {
			expectedRequest = args
			var url = args.url

			doRequest( {
				url : url,
				type : args.data ? "POST" : "GET",
				data : args.data,
				disableAntiBurst : args.disableAntiBurst,
				success : function(response, sentArgs) {
					if ((expectedRequest.url == sentArgs.url || sentArgs.disableAntiBurst) && expectedRequest.success)
						args.success.call( expectedRequest, response, sentArgs )
				},
				error : function onRequestError(failureResponse, sentArgs) {
					if ((expectedRequest.url == sentArgs.url || sentArgs.disableAntiBurst) && expectedRequest.error)
						args.error.call( expectedRequest, failureResponse, sentArgs )
				}
			} )

		}
	}
} )
