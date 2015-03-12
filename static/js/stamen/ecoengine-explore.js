(function () {

  function init() {
    (function() {
      var isAutozoom = false;

      var fields = [
        "record",
        "scientific_name",
        "country",
        "state_province",
        "begin_date",
        "end_date",
        "geojson",
        "observation_type"
      ];

      var queryObj = {
        page_size: 100,
        page: 1,
        facets: {
          kingdom: false,
          phylum: false,
          clss: false,
          order: false,
          family: false,
          genus: false,
          'scientific_name': false,
          'state_province': false,
          resource: false
        },
        bbox: "",
        sortFields: {},
        advanced: {},
        q: "",
        min_date: "",
        max_date: ""
      };

      fields.forEach(function(d) { queryObj.sortFields[d] = false; });

      function logHash(hash) {
        //console.log(hash);
        if (hash.parameters) {
          var parameters = hash.parameters;
          for (var name in parameters) {
            var value = parameters[name];
            //console.log(name,value);
            if (name == "q") {
              var fields = value.replace(/"/g, "").split(",")
              queryObj.q = fields[0];
              fields.slice(1).forEach(function(d) {
                var pair = d.split(":");
                queryObj.advanced[pair[0]] = pair[1];
              });
            } else if (name == "ordering") {
              var fields = value.split(",")
              fields.forEach(function(d) {
                var field = d.replace("-","");
                queryObj.sortFields[field] = d[0] == "-" ? "-" : "+";
              });
            } else if (name == "selected_facets") {
              var items = value.replace(/"/g, "").split(",")
              items.forEach(function(d) {
                var pair = d.split(":");
                queryObj.facets[pair[0].replace(/_exact/g, "")] = pair[1];
              });
            } else {
              queryObj[name] = value;
            }
          }
        } else {
          console.log("There are no parameters.");
          console.log(hash.raw);
        }
      }

      initHashNav(logHash);

      if (queryObj.q) {
        d3.select("#searchterm").node().value = queryObj.q;
      }
      if (queryObj.min_date) {
        d3.select("#minyear").node().value = queryObj.min_date;
      }
      if (queryObj.max_date) {
        d3.select("#maxyear").node().value = queryObj.max_date;
      }


      var mapData = [];
      var photoData = [];
      var sensorData = [];

      // TODO: refactor ECO variable
      // var ECO = ECO || {};


      var sortOrder = {
        'resource': -3,
        'observation_type': -1,
        georeferenced: 1,
        country: 2,
        'state_province': 3,
        kingdom: 5,
        phylum: 7,
        clss: 9,
        order: 11,
        family: 13,
        genus: 15,
        'scientific_name': 17
      };

      var dateformat = d3.time.format("%Y %b %e");
      var compactdateformat = d3.time.format("%Y-%m-%d");

      var advancedSearchSections = d3.select("#advanced-search-pane")
        .selectAll("div.section")
        .data(ECO.advancedSearch)
        .enter().append("div")
        .attr("class", "section");

      advancedSearchSections.append("h3")
        .text(function(d) { return d.section; });

      var table = advancedSearchSections
        .append("table")

      var rows = table
        .selectAll("tr.field")
        .data(function(d) { return d.fields; })
        .enter().append("tr")
        .attr("class", "field");

      rows.append("td")
        .text(function(d) { return capitaliseFirstLetter(d.field
                .replace(/_/g, " ")
                .replace("clss", "class")
              ); });

      rows.append("td")
        .append("input")
        .attr("type", "text")
        .attr("class", "eco-param2")
        .attr("placeholder", function(d) {
          return "placeholder" in d ? d.placeholder : null;
        })
        .attr("value", function(d) {
          return d.field in queryObj.advanced ? queryObj.advanced[d.field] : null;
        })
        .on("change", function(d) {
          queryObj.advanced[d.field] = this.value;
        });

      d3.selectAll(".search-btn").on("click", function() {
        query();
        hideflydowns();
      });


      d3.select("#advanced-search-btn").on("click", function() {
        if (d3.select("#advanced-search").style("display") == "block") {
          hideflydowns();
          return;
        }

        d3.selectAll(".flydown")
          .style("display", null)
          .style("opacity", 0);
        d3.select("#advanced-search")
          .style("display", "block")
          .transition()
          .style("height", (window.innerHeight-38) + "px")
          .style("opacity", 1);
      });

      d3.select("#export-btn").on("click", function() {
        if (d3.select("#export-pane").style("display") == "block") {
          hideflydowns();
          return;
        }

        d3.selectAll(".flydown")
          .style("display", null)
          .style("opacity", 0)
        d3.select("#export-pane")
          .style("display", "block")
          .transition()
          .style("height", (window.innerHeight-38) + "px")
          .style("opacity", 1);
      });

      d3.selectAll(".hide-btn").on("click", hideflydowns);

      function hideflydowns() {
        d3.selectAll(".flydown")
          .transition()
          .duration(250)
          .style("opacity", 0)
          .style("height", "0px")
          .transition()
          .delay(250)
          .style("display", null)
      };

      function loadingCheck(type) {
        d3.select("#" + type + "-check")
          .classed("error", false)
          .attr("disabled", "disabled")
          .attr("checked", null)
          .on("change", function() {});
        d3.select("." + type + "-label")
          .style("color", "#c82");
        d3.selectAll(".error-label").remove();
      };

      function loadedCheck(type) {
        d3.select("#" + type + "-check")
          .attr("disabled", null)
          .attr("checked", "checked")
          .on("change", function() {
            var layerCheckMap = {
              observations: 'eco-observation',
              photos: 'photo',
              sensors: 'sensor',
              reserves: 'reserve'
            };

            if (this.checked) {
              d3.selectAll("." + layerCheckMap[type])
                .style("display", null);
            } else {
              d3.selectAll("." + layerCheckMap[type])
                .style("display", "none");
            }

          });
        d3.select("." + type + "-label")
          .style("color", null);
      };

      function errorCheck(type, err) {
        d3.select("." + type + "-label")
          .style("color", "#a00")
          .append("div")
          .attr("class", "error-label")
          .style("text-align", "center")
          .text("(" + err + " error)");
      };

      // autozoom toggle
      d3.select("#autozoom-check")
        .on("change", function(d) {
          isAutozoom = this.checked;
        });

      d3.select("#export-sensors")
        .attr("href", ECO.endpoints.sensors)
        .text(ECO.endpoints.sensors);
      loadingCheck("sensors");
      d3.json(ECO.endpoints.sensors, function(error, data) {
        loadedCheck("sensors");

        map.clear();
        sensorData = data.features;

        map.draw();
      });

      ECO.map = function() {
        var __ = {};

        var defaultCenter = new L.LatLng(37.7,-122),
            defaultZoom = 2,
            markers = [],
            subscribers = [],
            map;


        var popup = L.popup({
          closeButton: false,
          autoPan: false,
          offset: new L.Point(0,-4)
        });

        map = __.map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView(defaultCenter, defaultZoom);

        map.scrollWheelZoom.disable();

        var zoomControls = new L.Control.ZoomExtras( {
            position: 'topleft',
            extras: [{
              text: '',
              title: 'Reset',
              klass: 'zoom-reset',
              onClick: function() {
                this._map.setView(defaultCenter, defaultZoom);
                // remove bounding box?
              },
              onDisabled: function(btn, className) {
              }
            }]
        }).addTo(map);


        var attributionControl = L.control.attribution({
          prefix: false
        }).addTo(map);

        var baseLayer = L.tileLayer(ECO.basemaps['Light'].url, {
          attribution: ECO.basemaps['Light'].attribution,
          subdomains: 'abc',
          minZoom: 1,
          transparent: true,
          maxZoom: 16
        }).addTo(map);

        var environmentLayer = L.tileLayer('', {
          attribution: '',
          subdomains: 'abc',
          minZoom: 2,
          transparent: true,
          maxZoom: 16
        }).addTo(map);

        var boundaryLayer = L.tileLayer('', {
          attribution: '',
          subdomains: 'abc',
          minZoom: 2,
          transparent: true,
          maxZoom: 16
        }).addTo(map);


        d3.select("#export-layers")
          .attr("href", ECO.endpoints.layers)
          .text(ECO.endpoints.layers);
        d3.select("#export-rasters")
          .attr("href", ECO.endpoints.rasters)
          .text(ECO.endpoints.rasters);
        // Layer select box

        d3.select("#loading-view .layers")
          .classed("loaded", false)
          .classed("error", false)
          .text("Loading...");
        d3.json(ECO.endpoints.layers, function(error, layers) {
          if (error) {
            d3.select("#loading-view .layers")
              .classed("error", true)
              .text(error.status + " Error");
            return;
          }
          d3.select("#loading-view .layers")
            .classed("error", false)
            .classed("loaded", true)
            .text("Loaded");

          d3.select("#loading-view .rasters")
            .classed("loaded", false)
            .classed("error", false)
            .text("Loading...");
          d3.json(ECO.endpoints.rasters.replace(/\.\.\/static/, "./static/"), function(error, rasters) {
            if (error) {
              d3.select("#loading-view .rasters")
                .classed("error", true)
                .text(error.status + " Error");
              return;
            }
            if (!rasters) return;

            d3.select("#loading-view .rasters")
              .classed("loaded", true)
              .classed("error", false)
              .text("Loaded");
            rasters.results.forEach(function(d) {
              if (d.tags.indexOf("boundaries") > -1) {
                d3.select("#boundary-select")
                  .append("option")
                  .attr("value", d.tile_template)
                  .text(d.name);
              } else {
                d3.select("#environment-select")
                  .append("option")
                  .attr("value", d.tile_template)
                  .text(d.name);
              }
            });
          });

          if (!layers) return;
          layers.results.forEach(function(d) {
              if (d.tags.indexOf("boundaries") > -1) {
                d3.select("#boundary-select")
                  .append("option")
                  .attr("value", d.tile_template)
                  .text(d.name);
              } else {
                d3.select("#environment-select")
                  .append("option")
                  .attr("value", d.tile_template)
                  .text(d.name);
              }
          });
        });

        d3.select("#layer-select")
          .selectAll("option")
          .data(d3.keys(ECO.basemaps))
          .enter().append("option")
          .text(String);

        d3.select("#layer-select")
          .on("change", function() {
            var name = this.value;
            //attributionControl.addAttribution(ECO.basemaps[name].attribution);
            d3.select("#map .leaflet-control-attribution")
              .html(ECO.basemaps[name].attribution);
            baseLayer.setUrl(ECO.basemaps[name].url);
          });
        d3.select("#boundary-select")
          .on("change", function() {
            boundaryLayer.setUrl(this.value);
          });

        d3.select("#environment-select")
          .on("change", function() {
            environmentLayer.setUrl(this.value);
          });

        /*
        var apiLayer = L.tileLayer(ECO.endpoints.tiles, {
          attribution: '&copy; <a href="http://ecoengine.berkeley.edu">EcoEngine</a>',
          subdomains: 'abc',
          minZoom: 1,
          maxZoom: 18
        }).addTo(map);
        */

        function clearMarkers() {
          markers.forEach(function(marker){
            marker.off('mouseover', onMarkerOver)
                  .off('mouseout', onMarkerOut)
                  .off('click', onMarkerClick);

            map.removeLayer(marker);
            marker = undefined;
          });

          markers.length = 0;
        }

        function onMarkerOver(evt) {
          showTooltip(evt);

          subscribers.forEach(function(s){
            if (s.over) s.over(evt);
          });
        }

        function onMarkerOut(evt) {
          hideTooltip();
          //hideDetailview();
          subscribers.forEach(function(s){
            if (s.out) s.out(evt);
          });
        }

        function onMarkerClick(evt) {
          if ('url' in evt.target.data_) {
            window.open(evt.target.data_.url,'_blank');
          } else if ('data_url' in evt.target.data_) {
            window.open(evt.target.data_.data_url,'_blank');
          }
          evt.originalEvent.preventDefault();
          subscribers.forEach(function(s){
            if (s.click) s.click(evt);
          });
        }

        function addPoly(layer, color) {
          var poly = L.geoJson(layer.geometry, {
            style: {
              className: 'reserve',
              color: color,
              weight: 1,
              opacity: 0.9,
              fillOpacity: 0.8

            }
          }).addTo(map);
          poly.data_ = layer.properties;

          poly.on('mouseover', onMarkerOver)
              .on('mouseout', onMarkerOut)
              .on('click', onMarkerClick);
        };

        function addMarkers(data) {
          //console.log('markers', data)
          var bds = null;

          data.forEach(function(d){
            var type = '';
            if ('observation_type' in d.properties) {
              type = 'observation';
            } else if ('media_url' in d.properties) {
              type = 'photo';
            } else {
              type = 'sensor';
            }

            if (type == 'observation') {
              var markerIcon = L.divIcon({
                className: 'eco-basic-icon eco-observation ' + d.properties.observation_type.replace(/ /g,"-"),
                iconSize: new L.Point(12,12)
              });
            }

            if (type == 'photo') {
              var markerIcon = L.divIcon({
                className: 'eco-basic-icon photo media-photo',
                iconSize: new L.Point(12,12)
              });
            }

            if (type == 'sensor') {
              var markerIcon = L.divIcon({
                className: 'eco-basic-icon sensor',
                iconSize: new L.Point(12,12)
              });
            }

            var ll = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
            var m = L.marker(ll, {riseOnHover: true, icon: markerIcon}).addTo(map);
            m.data_ = d.properties;
            m.on('mouseover', onMarkerOver)
              .on('mouseout', onMarkerOut)
              .on('click', onMarkerClick);

            if (type == 'observation') {
              if (!bds) {
                bds = new L.latLngBounds([ll]);
              } else {
                bds.extend(ll);
              }
            }

            markers.push(m);
          });

          if (queryObj.bbox.length == 0) {
            if (bds && isAutozoom) {
              bds.pad(0.33);

              setTimeout(function(){
                // basic method to determine if bounds is big enough to set
                var tr = map.latLngToLayerPoint(bds.getNorthEast()),
                    bl = map.latLngToLayerPoint(bds.getSouthWest()),
                    xDiff = Math.abs(tr.x - bl.x),
                    yDiff = Math.abs(tr.y - bl.y);

                if (xDiff < 200 || yDiff < 200) {
                  map.setView(bds.getCenter(), 5);
                } else {
                  map.fitBounds(bds);
                }

              },200);
            }
          } else {
            var bbox = queryObj.bbox.split(",");
            // TODO fix this
            map.fitBounds([
              [bbox[1], bbox[0]],
              [bbox[3], bbox[2]]
            ]);
          }
        }

        function showTooltip(evt) {
            if (!evt.target.data_) return;

            var type = ''
            if ('observation_type' in evt.target.data_) {
              type = 'Observation';
            } else if ('media_url' in evt.target.data_) {
              type = 'Photo';
            } else if ('station_name' in evt.target.data_){
              type = 'Sensor';
            } else if ('layer' in evt.target.data_) {
              type = 'Reserve';
            }

            // tooltip header
            if (type == 'Observation') {
              var content = "<strong>" + type + " (" + evt.target.data_.observation_type + ")</strong><br/>";
            } else if (type == 'Reserve') {
              var content = "<strong>" + evt.target.data_.name + "</strong><br/>";
            } else {
              var content = "<strong>" + type + "</strong><br/>";
            }

            // tooltip content
            if (type == 'Observation') {
              content += evt.target.data_['scientific_name'] + "<br/>" + evt.target.data_['record'];
            }
            if (type == 'Photo') {
              content += "<img src='" + evt.target.data_['media_url'] + "'/><br/>";
              content += evt.target.data_['authors'] + "<br/>";
              content += evt.target.data_['record'];
            }
            if (type == 'Sensor') {
              content += evt.target.data_['station_name'] + "<br/>"
              content += evt.target.data_['record'];
            }
            if (type == 'Reserve') {
              content += evt.target.data_['record'];
            }

            popup
                .setLatLng(evt.latlng)
                .setContent(content)
                .openOn(map);
        }

        function hideTooltip() {
            popup._close();
        }

        __.showTooltip = showTooltip;
        __.hideTooltip = hideTooltip;


        /**
         * Add listener objects for markers
         * @param  Object {over:fn, out: fn, click: fn}
         * @return subscribers Array || this
         */
        __.subscribe = function(_) {
          if (!_) return subscribers;
          subscribers.push(_);
          return __;
        }

        __.clear = clearMarkers;

        __.draw = function() {
          /*
          if (!data.length) {
            ECO.mapAlert.set('No map data available.');
            return;
          }
          */

          ECO.mapAlert.hide();

          if (mapData.length) addMarkers(mapData);
          if (sensorData.length) addMarkers(sensorData);
          if (photoData.length) addMarkers(photoData);
        }

        __.addPoly = addPoly;

        return __;
      };

      ECO.mapAlert = {
        rootElm: d3.select('.map-info'),
        contentElm: d3.select('.map-info-content'),
        closeElm: null,
        show: function(){
          if(this.rootElm.classed('visible')) return;
          this.rootElm.classed('visible', true);
        },
        hide: function() {
          this.rootElm.classed('visible', false);
        },
        set: function(str) {
          this.contentElm.text(str);
          if (!this.closeElm) {
            d3.select('.map-info-close').on('click',function(){
              ECO.mapAlert.hide();
            })
          }
          if (!this.rootElm.classed('visible')) this.show();
        }
      };

      ECO.list = function() {
        var __ = {};

        var barwidth = d3.scale.linear()
          .range([0, 100]);

        __.draw = function(data) {
          d3.selectAll(".field-plot a").style("color", null);

          // Total bar width
          var maxcount = 0;
          for (var key in data.fields) {
            var count = 0;
            data.fields[key].forEach(function(d) {
              count += d[1];
            });
            if (count > maxcount) maxcount = count;
          }
          barwidth.domain([0, maxcount]);

          var searchfields = d3.keys(data.fields);
          searchfields.sort(function(a,b){
            var one = a in sortOrder ? sortOrder[a] : 100;
            var two = b in sortOrder ? sortOrder[b] : 100;
            return one - two;
          });

          // Groups
          var fieldplot = d3.select("#search-bars")
            .html("")
            .selectAll("div.field-plot")
            .data(searchfields.map(function(key) { return {
              "field": key,
              "values": data.fields[key]
            }}))
            .enter().append("div")
            .attr("class", "field-plot");

          fieldplot.append("h3")
            .text(function(d) {
              return capitaliseFirstLetter(d.field
                .replace(/_/g, " ")
                .replace("clss", "class")
              )});

          var bars = fieldplot.append("div")
              .attr("class", "bar-group")
              .selectAll("div.bars")
              .data(function(d) { return d.values; })
              .enter().append("div")
              .attr("class", "bars")
              .attr("title", "Click to toggle filter")
              .append("div")
              .classed("alert alert-success", function(d,i,g) {
                return queryObj.facets[searchfields[g]] == d[0];
              })
              .on("mouseout", function() {
                //hideDetailview();
              })
              .on("click", function(d,i,g) {
                queryObj.page = 1;
                if (queryObj.facets[searchfields[g]] == d[0]) {
                  queryObj.facets[searchfields[g]] = false;
                } else {
                  queryObj.facets[searchfields[g]] = d[0];
                }
                query();
              });

          bars.append("div")
            .attr("class", "bar")
            .style("height", "12px")
            .style("width", function(d) { return Math.round(barwidth(d[1])) + "px"; });

          bars.append("span")
            .text(function(d) { return " " + capitaliseFirstLetter(d[0]); });

          bars.append("span")
            .attr("class", "count")
            .text(function(d) { return "(" + d[1] + ")"; });

          bars.append("span")
            .attr("class", "x")
            .text(" x");
        }
        return __;
      };

      ECO.datatable = function() {
        var __ = {};

        __.mapEvents = {
            over: function(evt) {
              if (!evt.target.data_) return;
              var props = evt.target.data_;
              __.table.selectAll("tr.listing")
                .classed("active", function(d) {
                  return props.record == d.properties.record;
                });
              //console.log("Datatable: Marker mouseover: ", props.record);
            },
            out: function(evt) {
              if (!evt.target.data_) return;
              var props = evt.target.data_;
              __.table.selectAll("tr.listing")
                .classed("active", false);
              //console.log("Datatable: Marker mouseout: ", props.record);
            },
            click: function(evt) {
              if (!evt.target.data_) return;
              var props = evt.target.data_;
              //console.log("Datatable: Marker click: ", props.record);
            }
        };

        __.draw = function(data) {
          __.table = d3.select("#results")
            .append("table")
            .attr("class", "table");

          var headers = __.table.append("tr")
            .selectAll("th")
            .data(fields)
            .enter().append("th")
            .text(function(d) {
              return capitaliseFirstLetter(d).replace(/_/g, " ");
            })
            .attr("class", function(d) {
              if (queryObj.sortFields[d] == "+") {
                return "ascending";
              }
              if (queryObj.sortFields[d] == "-") {
                return "descending";
              }
            })
            .on("click", function(d) {
              if (queryObj.sortFields[d] == false) {
                queryObj.sortFields[d] = "+";
              } else if (queryObj.sortFields[d] == "+") {
                queryObj.sortFields[d] = "-";
              } else if (queryObj.sortFields[d] == "-") {
                queryObj.sortFields[d] = "+";
              }
              query();
            });

          headers.append("span")
            .attr("class", "asc-arrow")
            .html("&#9650");

          headers.append("span")
            .attr("class", "desc-arrow")
            .html("&#9660");

          __.table
            .selectAll("tr.listing")
            .data(data.features)
            .enter().append("tr")
            .attr("class", "listing")
            .classed("zebra", function(d,i) { return i % 2 == 0;})
            .on("mouseover", function(d) {

              __.table.selectAll("tr.listing")
                .classed("active", false);
              d3.select(this).classed("active", true);

              var evt = {
                latlng: [d.geometry.coordinates[1],d.geometry.coordinates[0]],
                target: {
                  data_: d.properties
                }
              }
              map.showTooltip(evt);

            })
            .on("mouseout", function() {
              __.table.selectAll("tr.listing")
                .classed("active", false);
              map.hideTooltip();
            })
            .each(function(d) {
              var entry = d3.select(this)
                .selectAll("td")
                .data(fields)
                .enter().append("td")

              entry.append("span")
                .attr("class", "value")
                .html(function(key) {
                  var props = d.properties;
                  if (typeof props[key] == "string") {
                    if (props[key].slice(0,4) == "http") {
                      return "<a href='" + props[key] + "'>" + props[key] + "</a>";
                    }
                    if (key == "record") {
                      if (props["remote_resource"] !== "") {
                        return "<a href='" + props["remote_resource"] + "'>" + props[key] + "</a>";
                      }
                      return props[key]
                    }
                    if (key == "begin_date") {
                      return dateformat(new Date(props[key]));
                    }
                    if (key == "end_date") {
                      return dateformat(new Date(props[key]));
                    }
                    if (key == "observation_type") {
                      return "<span class='eco-basic-icon " + props[key].replace(/ /g,"-") + "'></span>" + props[key];
                    }
                    return props[key]
                  }
                  if (key == "geojson") {
                    return !!d.geometry ? "Yes" : "";
                  }
                  return JSON.stringify(props[key]);
                });
            });
        }

        return __;
      };


      var fieldlist = new ECO.list();
      var datatable = new ECO.datatable();
      var map = new ECO.map().subscribe(datatable.mapEvents);
      var timebrush = d3.svg.brush()

      d3.select("#export-reserves")
        .attr("href", ECO.endpoints.reserves)
        .text(ECO.endpoints.reserves);

      loadingCheck("reserves");
      d3.json(ECO.endpoints.reserves, function(error, data) {
        if (error) {
          errorCheck("reserves", error.status);
          return;
        };
        loadedCheck("reserves");

        if (!data) return;
        data.features.forEach(function(d) {
          d3.select("#reserve-list")
            .append("option")
            .attr("value", JSON.stringify(d.geometry))
            .text(d.properties.name)
          map.addPoly(d, "#fb5");
        });

        d3.select("#reserve-list")
          .on("change", function() {
            if (this.value == 0) return;

            var geojson = JSON.parse(this.value);
            var coords = flatten(geojson.coordinates);
            var bds = findBounds(coords);

            var bbox = [
              bds.left,
              bds.bottom,
              bds.right,
              bds.top
            ];

            queryObj.bbox = bbox.join(",");

            map.map.fitBounds([
              [bbox[1], bbox[0]],
              [bbox[3], bbox[2]]
            ]);

            query();
          });
      });

      d3.select("#export-jepson")
        .attr("href", ECO.endpoints.jepson)
        .text(ECO.endpoints.jepson);

      loadingCheck("jepson");
      d3.json(ECO.endpoints.jepson, function(error, data) {
        if (error) {
          errorCheck("jepson", error.status);
          return;
        };
        loadedCheck("jepson");

        if (!data) return;
        data.features.forEach(function(d) {
          d3.select("#jepson-list")
            .append("option")
            .attr("value", JSON.stringify(d.geometry))
            .text(d.properties.name);
        });
        d3.select("#jepson-list")
          .on("change", function() {
            if (this.value == 0) return;

            var geojson = JSON.parse(this.value);
            var coords = flatten(geojson.coordinates);
            var bds = findBounds(coords);

            var bbox = [
              bds.left,
              bds.bottom,
              bds.right,
              bds.top
            ];

            queryObj.bbox = bbox.join(",");

            map.map.fitBounds([
              [bbox[1], bbox[0]],
              [bbox[3], bbox[2]]
            ]);

            query();

          });
      });

      // filter by bounding box
      d3.select("#bbox-select")
        .on("click", function() {
          var bds = map.map.getBounds();
          // needs to be bottom left, upper right
          var bbox = [bds._southWest.lng, bds._southWest.lat, bds._northEast.lng, bds._northEast.lat].join(",");
          queryObj.bbox = bbox;
          query();
        });

      // text boxes
      d3.selectAll(".eco-param")
        .on("change", function() {
          queryObj.q = d3.select("#searchterm").node().value;
          queryObj.min_date = d3.select("#minyear").node().value;
          queryObj.max_date = d3.select("#maxyear").node().value;
          timebrush.extent([new Date(queryObj.min_date), new Date(queryObj.max_date)]);
          d3.select("#time-slider .brush").call(timebrush);

          queryObj.page = 1;
          query();
        });


      // time slider
      (function() {
        var margin = {top: 2, right: 14, bottom: 23, left: 14};
        var height = 1;
        var width = 250;

        queryObj.min_date = d3.select("#minyear").node().value;
        queryObj.max_date = d3.select("#maxyear").node().value;

        var x = d3.time.scale()
          .range([0, width])
          .domain([new Date("Jan 1 1900"), new Date()]).nice();
      //    .domain([new Date(minyear), new Date(maxyear)]).nice();

        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        timebrush.x(x)
            .on("brush", brushed)
            .on("brushend", brushend)

        if (queryObj.min_date.length > 0 && queryObj.max_date.length >0){
          timebrush.extent([new Date(queryObj.min_date),new Date(queryObj.max_date)]);
        }

        var context = d3.select("#time-slider")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("class", "context")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,2)")
            .call(xAxis);

        var timebrushEl = context.append("g")
            .attr("class", "x brush")
            .call(timebrush)

        timebrushEl.selectAll("rect")
            .attr("y", -2)
            .attr("height", height + margin.bottom)

        timebrushEl.selectAll("rect.background")
            .append("title")
            .text("Click and drag a time range");

        timebrushEl.selectAll(".resize rect")
          .attr("x", -1)
          .attr("width", 2)
          .style("visibility", null)

        timebrushEl.selectAll(".extent")
          .append("title")
          .text("Drag to shift time range");


        function brushed() {
          var extent = timebrush.extent();

          var min_date = compactdateformat(extent[0]);
          var max_date = compactdateformat(extent[1]);

          // no single date ranges
          if (min_date == max_date) {
            min_date = "";
            max_date = "";
          }

          queryObj.min_date = d3.select("#minyear").node().value = min_date;
          queryObj.max_date = d3.select("#maxyear").node().value = max_date;
        }

        function brushend() {
          var extent = timebrush.extent();
          if (compactdateformat(extent[0]) == compactdateformat(extent[1])) {
            // reset brushes
            d3.select("#minyear").node().value = "";
            d3.select("#maxyear").node().value = "";
          }
          query();
        }

      })();

      query();

      function showLoadingView() {
        d3.select("#details").style("display", "block");
        d3.select("#detail-type").text("Loading ");
        d3.select("#loading-view").style("display", null);
        d3.select("#detail-view").style("display", "none");
      };

      function hideDetailview() {
        d3.select("#details")
          .transition()
          .duration(400)
          .style("margin-left", "-28%");
      };

      function query() {
        showLoadingView();
        d3.select("#results").style("color", "#bbb");

        var facetlist = d3.entries(queryObj.facets)
          .filter(function(d) { return d.value; });
        var facetstring = facetlist.map(function(d) {
          return "&selected_facets=" + d.key + "_exact%3A%22" + d.value + "%22";
        }).join("&");

        var sortlist = d3.entries(queryObj.sortFields)
          .filter(function(d) { return d.value; });
        var sortstring = sortlist.map(function(d) {
          return (d.value == "-" ? "-" : "") + d.key;
        }).join(",");

        var orderString = "";
        if (sortstring.length > 0) {
          orderString += "&ordering=" + sortstring;
        }

        var bboxString = "";
        if (queryObj.bbox) {
          bboxString = "&bbox=" + queryObj.bbox;
        }

        var advancedString = "";
        for (var key in queryObj.advanced) {
          advancedString += ",";
          advancedString += key;
          advancedString += ':"';
          advancedString += queryObj.advanced[key];
          advancedString += '"';
        }
        //console.log(advancedString);

        var dateString = "";
        if (queryObj.min_date) {
          dateString += "&min_date=" + queryObj.min_date;
        }
        if (queryObj.max_date) {
          dateString += "&max_date=" + queryObj.max_date;
        }

        var qString = "&q=";
        var qStringSimple = "&q=";
        if (queryObj.q.length > 0 || advancedString.length > 0) {
          qString += queryObj.q + advancedString;
          qStringSimple += queryObj.q;
        }

        var pageString = "";
        if (queryObj.page > 1) {
          pageString = "&page=" + queryObj.page;
        }

        var hashString = orderString + facetstring + qString + bboxString + dateString + "&page_size=" + queryObj.page_size + pageString;

        window.location.hash = hashString;

        var querystring = ECO.endpoints.observations + "?format=geojson" + hashString;
        var searchquerystring = ECO.endpoints.search + "?format=json" + orderString + facetstring+ qString + bboxString + dateString + "&facets_limit=100";
        var photoquerystring = ECO.endpoints.photos  + "?format=geojson" + orderString+ qStringSimple + bboxString + dateString + "&page_size=80page=1";
        var photogallery = "../photos/#" + orderString+ qStringSimple + bboxString + dateString;

        //console.log(querystring);

        // share link
        d3.select("#share-the-page")
          .attr("href", window.location.href)
          .text(window.location.href);

        // export links
        d3.select("#export-observations")
          .attr("href", querystring)
          .text(querystring);
        d3.select("#export-view")
          .attr("href", ECO.endpoints.observations + "?" + orderString + facetstring + qString + bboxString + dateString + "&page_size=" + queryObj.page_size + pageString);
        d3.select("#export-csv")
          .attr("href", ECO.endpoints.observations + "?format=csv" + orderString + facetstring + qString + bboxString + dateString + "&page_size=" + queryObj.page_size + pageString);
        d3.select("#export-json")
          .attr("href", ECO.endpoints.observations + "?format=json" + orderString + facetstring + qString + bboxString + dateString + "&page_size=" + queryObj.page_size + pageString);
        d3.select("#export-geojson")
          .attr("href", ECO.endpoints.observations + "?format=geojson" + orderString + facetstring + qString + bboxString + dateString + "&page_size=" + queryObj.page_size + pageString);

        loadingCheck("observations");
        d3.select("#results-loading")
          .classed("alert", true)
          .html("<strong>Loading...</strong>");
        d3.json(querystring, function(error, data) {
          if (error) {
            errorCheck("observations", error.status);
            return;
          }
          d3.select("#results").html("").style("color", null);
          loadedCheck("observations");

          if (error) {
            d3.select("#results").append("div").html(error.responseText).style("color", "red");
            return;
          }

          // Paging
          var startitem = queryObj.page_size*(queryObj.page-1);
          var enditem = Math.min(queryObj.page_size*(queryObj.page),data.count);
          var pagination = d3.select("#results")
            .append("div")
            .attr("class", "paging");

          pagination.append("span").text("Results " + (startitem+1) + " to " + enditem + " of " + data.count + " - ");

          var pagecount = Math.ceil(data.count/queryObj.page_size);
          pagination.append("span")
            .attr("class", "pagination")
            .selectAll("span")
            .data(d3.range(1, pagecount+1).slice(0,20))
            .enter().append("span")
            .classed("active", function(d) { return d == queryObj.page;})
            .text(String)
            .on("click", function(d) {
              if (d == queryObj.page) return;
              queryObj.page = d;
              query();
            });

          // TEMPORARY warning of high page counts
          if (pagecount > 20) {
            d3.select("#results .pagination").append("em")
              .text("(more data available)");
          }

          var pagesize = pagination
            .append("div")
            .attr("class", "pagination")
            .text("Page size ");

          pagesize.selectAll(".page-size")
            .data([20,50,100,500,1000,2000])
            .enter().append("span")
            .text(String)
            .attr("class", "page-size")
            .classed("active", function(d) { return d == queryObj.page_size; })
            .on("click", function(d) {
              queryObj.page_size = d;
              d3.selectAll(".page-size").classed("active", function(d) { return d == queryObj.page_size; })
              query();
            });

          d3.select(".pagination").append("div")
            .style("clear", "both");

          d3.select("#results-loading")
            .classed("alert", false)
            .html("");
          datatable.draw(data);

          mapData = dataFilterCoordinates(data || []);
          map.clear();
          map.draw();

          /*
          d3.range(2,Math.min(10,pagecount)).forEach(function(nextpage) {
            var nextquerystring = ECO.endpoints.observations + "?ordering=" + orderstring + facetstring + "&format=geojson&q=" + queryObj.q + "&min_date=" + minyear + "&max_date=" + maxyear + "&page_size=" + queryObj.page_size + "&page=" + nextpage;
            d3.json(nextquerystring, function(error, data) {
            console.log(data);
              mapData.concat(dataFilterCoordinates(data || []));
              map.draw(mapData);
            });
          });
          */

        });


        d3.selectAll(".field-plot a").style("color", "#bbb");
        d3.select("#export-search")
          .attr("href", searchquerystring)
          .text(searchquerystring);

        d3.select("#loading-view .search")
          .classed("loaded", false)
          .classed("error", false)
          .text("Loading...");
        d3.select("#search-loading")
          .classed("alert", true)
          .html("<strong>Loading...</strong>");
        d3.json(searchquerystring, function(error, data) {
          if (error) {
            d3.select("#loading-view .search")
              .classed("error", true)
              .text(error.status + " Error");
            return;
          }
          d3.select("#loading-view .search")
            .classed("loaded", true)
            .classed("error", false)
            .text("Loaded");
          d3.select("#search-loading")
            .classed("alert", false)
            .html("");
          fieldlist.draw(data);
        });

        d3.select("#export-photos")
          .attr("href", photoquerystring)
          .text(photoquerystring);
        d3.select("#photo-gallery")
          .attr("href", photogallery);
        loadingCheck("photos");
        d3.json(photoquerystring, function(error, data) {
          if (error) {
            errorCheck("photos", error.status);
            return;
          }
          loadedCheck("photos");
          photoData = dataFilterCoordinates(data || []);

          map.draw();

        });
      };

      // Flatten nested coordinate arrays, like MultiPolygon
      function flatten(arr) {
        var ret = [];
        arr.forEach(function(inner) {
          inner.forEach(function(d) {
            if (typeof d[0] == "number") {
              ret.push(d);
            } else {
              d.forEach(function(p) {
                ret.push(p);
              });
            }
          });
        });
        return ret;
      };

      // Find bounding box for coordinates
      function findBounds(coords) {
        var top = coords[0][1],
            right = coords[0][0],
            bottom = coords[0][1],
            left = coords[0][0];

        coords.forEach(function(d) {
          if (d[1] > top) top = d[1];
          if (d[1] < bottom) bottom= d[1];
          if (d[0] > right) right = d[0];
          if (d[0] < left) left = d[0];
        });

        return {
          top: top,
          right: right,
          bottom: bottom,
          left: left
        }
      };

      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      function dataFilterCoordinates(data) {
        if (!data || !data.hasOwnProperty('features')) return [];
        if (!data.features.length) return [];

        return data.features.filter(function(d){
          return d.geometry && d.geometry.coordinates.length === 2;
        });
      }
    })();

    //
    // Copy query dialog
    //

    (function() {

      d3.select("#get-query-btn").on("click", function() {

        swal({
          "title"              : "Here is your query URL",
          "text"               : d3.select("#export-geojson").attr("href"),
          "showCancelButton"   : true,
          "cancelButtonText"   : "Close",
          "confirmButtonText"  : "Go to Compare",
          "confirmButtonColor" : "#00B5E2",
          "closeOnConfirm"     : false,
          "customClass"        : "modal-share"
        }, function() {
          location.href = "http://studio.stamen.com/berkeley/show/compare/";
        });

        var sweetAlert = document.querySelector(".sweet-alert");

        if (sweetAlert) {
          sweetAlert.removeAttribute("tabIndex");
        }

      }, false);

    }());

  }

  //
  // If integrating with holos
  //
  if (!STMN.dynamicTemplate || STMN.dynamicTemplate && STMN.dynamicTemplateReady) {
    init();
  } else {
    STMN.onTemplateReady = init;
  }

}());
