# Berkeley Ecoinformatics Search Engine

For this project, Stamen designed a rich search interface to explore the Berkeley Ecoengine API. Here's a screenshot:

![image](https://cloud.githubusercontent.com/assets/1423200/5288977/bd8c6db2-7aee-11e4-83e6-46ada43cab8c.png)

The Stamen-built prototype lives at http://studio.stamen.com/berkeley/show/ecoengine/explore (password protected, inquire with teh Ecoengine team if you need access).

See more about the API at https://ecoengine.berkeley.edu/

The live interface will live at http://holos.berkeley.edu/explore/

## Configuration

* Describe `config.js`
* Instructions for switching development vs. production version of the API

## Dependencies

### Software

This is a front-end-development project only, and it relies on the following (called in `index.html`)

* `http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css`
* `http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js`
* `http://d3js.org/d3.v3.min.js`
* `/lib/zoom-extras.js`
* `/lib/hashnav.js`
* `config.js`

### Data

* All data comes from the Berkeley Ecoinformatics API, documented at https://dev-ecoengine.berkeley.edu/docs/quickstart.html
* The Stamen prorotype uses the dev API at https://dev-ecoengine.berkeley.edu. See "Configuration" above for instructions for changing that to the production version.

### Static Assets

* Location and (basic) description of images, existing CSS, HTML, etc.

## How do I install it?

Just clone the repo and use your favorite web server in `/ecoengine` to test locally.

## How do I deploy it to the world?

What specific section(s) of `index.html` need to be brought into a production environment to function?

