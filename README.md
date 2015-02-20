# EcoEngine Explorer

Stamen built a search interface to explore the Berkeley Ecoengine API. Here's a screenshot:

[![EcoEngine](https://cloud.githubusercontent.com/assets/156229/5325698/82deef8a-7ca8-11e4-8a4a-921b5c684152.png)](http://stamen.github.io/ecoengine/explore/)

## Prototypes

* [Explore](http://stamen.github.io/ecoengine/explore/)
* [Lizards and Woodrats](http://stamen.github.io/ecoengine/prototypes/covis/lizards-woodrats.html)
* [Taxa Sampling Distributions](http://stamen.github.io/ecoengine/prototypes/covis/multiples-taxa.html)
* [Woodrats over Decades](http://stamen.github.io/ecoengine/prototypes/covis/multiples-decades.html)
* [Quercus](http://stamen.github.io/ecoengine/prototypes/covis/oaks.html)
* [Photos](http://stamen.github.io/ecoengine/photos/)
* [Bulk Download](http://stamen.github.io/ecoengine/prototypes/loading/bulk-download.html)
* [Observations](http://stamen.github.io/ecoengine/prototypes/observations/)
* [Antarctic Chordata](http://stamen.github.io/ecoengine/prototypes/projections/antarctica.html)
* [Arctic Chordata](http://stamen.github.io/ecoengine/prototypes/projections/arctic.html)
* [Early version of Explore](http://stamen.github.io/ecoengine/prototypes/multi/)
* [Sensors](http://stamen.github.io/ecoengine/prototypes/sensors/index.html) - a simple "hello world" of accessing and printing EcoEngine data with d3


## Explore Features

[Explore](http://stamen.github.io/ecoengine/explore) is a tool for browsing diverse parts of EcoEngine. Open the *Queries* tab to see what APIs are accessed.

* Search box
* Brushable time filter
* Faceted search with histograms *(filters only Observation queries)*
* Raster map with multiple layers
* Marker map display of Observations, Sensors, Photos
* Polygon map display of Regions
* Advanced attribute search
* Bounding box search
* Footprint search

## Configuration

Some parts of the interface can be configured in `config.js`. Those capabilities are detailed here.

### Endpoints

`ECO.endpoints` sets which API endpoints are queried to receive particular datasets. The latest prototype points to the following links:

```
ECO.endpoints = {
  search: 'https://dev-ecoengine.berkeley.edu/api/search/',
  observations: 'https://dev-ecoengine.berkeley.edu/api/observations/',
  photos: 'https://dev-ecoengine.berkeley.edu/api/photos/',
  sensors: 'https://dev-ecoengine.berkeley.edu/api/sensors/?page_size=5000&format=geojson',
  layers: 'https://dev-ecoengine.berkeley.edu/api/layers/',
  rasters: 'rstore.json',    // permissions issue at this endpoint
  reserves: 'https://dev-ecoengine.berkeley.edu/api/layers/reserves/features/?page_size=500',
  jepson: 'https://dev-ecoengine.berkeley.edu/api/layers/jepson-regions/features/?page_size=500'
};
```

For production, `dev-` should be removed from each URL.

### Basemaps

`ECO.basemaps` are tileset URLs that appear in the Basemap dropdown. Here is an example:

```
  'Stamen Terrain': {
    'url': 'http://{s}.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg',
    'attribution': 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
  }
```

The key is used as the name of the dropdown. URL and attribution values are both required for each tileset added to EcoEngine.

The four basemaps in the initial version of Explorer are `Light`, `Dark`, `OpenStreetMap` and `Stamen Terrain` (which currently only covers part of North America).

### Advanced attribute search fields

`ECO.advancedSearch` fields show up in the "Advanced" tab. An `alias` can be provided to display as the label.

Currently only fields of type `text` are supported.

## Technical Details

### Dependencies

The interface does not require a backend to operate, aside from the EcoEngine APIs necessary to load the data Explorer exposes.

The following libraries are required to run the Explorer interface.

* [d3.js](http://d3js.org/d3.v3.min.js)
* [leaflet.js](http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js)
* [zoom-extras.js](/lib/zoom-extras.js)
* [hashnav.js](/lib/hashnav.js)

As well as these stylesheets.

* [leaflet.css](http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css)
* [bootstrap.css](//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css)

### Data

* All data comes from the Berkeley Ecoinformatics API, documented at https://dev-ecoengine.berkeley.edu/docs/quickstart.html
* The Stamen prorotype uses the dev API at https://dev-ecoengine.berkeley.edu. See "Configuration" above for instructions for changing to the production version.

### Static Assets

* /explore/index.html
* /explore/config.js
* /explore/rstore.json          - temporary workaround file, should be removed in the future

## Photos

A basic fullscreen photo viewer.

[![EcoEngine](https://cloud.githubusercontent.com/assets/156229/5325740/c78b40d8-7ca9-11e4-99e7-8426a3e15cff.png)](http://stamen.github.io/ecoengine/photos/)

## How do I run the project locally?

Clone the repo and a run a web serve in the project directory to view the project, or deploy it to a web server.
