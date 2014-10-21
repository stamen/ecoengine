var currentHashNav = null;

//Call this, passing it a callback function
function initHashNav(callback) {
	
	if (!callback) return false;

	if (typeof callback !== "function") {

		throw "hashnav.js requires a callback function that does something with the hash.";
		return false;

	}

	if ("onhashchange" in window) {
	    window.onhashchange = function(){checkHash(callback);};
	} else {
	    setInterval(function(){checkHash(callback);}, 100);        
	}

	checkHash(callback);
}

//Function called onhashchange or on loop (for older browsers)
function checkHash(callback) {	
	if (window.location.hash.replace(/^#/i,"") !== currentHashNav) {
		var newHash = window.location.hash.replace(/^#/i,"");		

		var chopped = chopHash(newHash);			
		callback(chopped);

		currentHashNav = newHash;
	}
}

/*
chop up a hash, return an object with three properties:

raw - the raw hash string
base - the base of a query string if it exists, otherwise null
	e.g. the base of 'page?variable=1' is 'page'
parameters - an object with a property/value for each query
	string parameter, otherwise null
	e.g. #page?state=CA&format=xml would give you:
		{
			state: "CA",
			format: "xml"
		}

		{
			raw: "page?state=CA&format=xml",
			base: "page",
			parameters: {
				state: "CA",
				format: "xml"
			}
		}

	if a parameter name has no value, it will be null.
	e.g. #page?details would give you:
		
		{
			raw: "page?details",
			base: "page",
			parameters: {
				details: null
			}
		}

*/
function chopHash(hash) {	
	//Do something with the new hash
	var hash = {
		raw: hash,
		base: decodeURIComponent(hash),
		parameters: null
	}

	if (hash.raw.match(/[?]/)) {
		//It's a query string with a base
		var chunks = hash.raw.split('?');

		hash.base = decodeURIComponent(hash.raw.replace(/[?].*/,""));
		hash.parameters = parametersFromString(hash.raw.replace(/.*[?]/,""));
	
	} else if (hash.raw.match(/[&]/)) {
		//It's a query string with no base
		hash.parameters = parametersFromString(hash.raw);
	}

	return hash;

}

//Break a query string like 'a=b&c=d' into an object with key/value pairs
function parametersFromString(paramString) {

	if (!paramString.length) return null;
	
	var paramPairs = paramString.split("&");

	if (!paramPairs.length) return null;

	var results = {};

	for (var i = 0, len = paramPairs.length; i < len; i++) {
		
		if (!paramPairs[i].length) continue;
		
		var kv = paramPairs[i].split("=");
		
		if (!kv[0].length) continue;
		
		results[decodeURIComponent(kv[0])] = kv.length > 1 ? decodeURIComponent(kv[1]) : null;		

	}

	for (var name in results) {
		return results;
	}

	return null;
}