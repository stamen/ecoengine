(function() {
  "use strict";

  window.STMN = window.STMN || {};

  window.STMN.dynamicTemplate = true;

  function request(uri, callback) {
    if (window && window.XMLHttpRequest) {
      var xmlHttp = null;

      xmlHttp = new window.XMLHttpRequest();

      xmlHttp.onreadystatechange = function() {
        if ((xmlHttp.readyState | 0) === 4 /*Done*/) {
          if ((xmlHttp.status|0) === 200 ) {

            callback(null, xmlHttp);
          } else {
            callback(xmlHttp);
          }
        }
      };

      xmlHttp.open("GET", uri, true);
      xmlHttp.send();
      return xmlHttp;
    } else {
      return false;
    }
  }

  //
  // Change this ID if you need the markup to be put in a different Div
  //
  var containerDiv = document.getElementById("ecoengine-explore-container");

  if (containerDiv) {
    request("./explore/index.html", function (err, r) {

      containerDiv.innerHTML = r.responseText.replace(/\.\.\/static/, "./static/");

      window.STMN.dynamicTemplateReady = true;
      if (typeof STMN.onTemplateReady === "function") {
        window.STMN.onTemplateReady();
      }

    });
  }
}());
