var ECO = ECO || {};

ECO.endpoints = {
  search: 'https://dev-ecoengine.berkeley.edu/api/search/',
  observations: 'https://dev-ecoengine.berkeley.edu/api/observations/',
  photos: 'https://dev-ecoengine.berkeley.edu/api/photos/',
  sensors: 'https://dev-ecoengine.berkeley.edu/api/sensors/?page_size=5000&format=geojson',
  layers: 'https://dev-ecoengine.berkeley.edu/api/layers/',
  rasters: '../static/js/stamen/rstore.json',
  reserves: 'https://dev-ecoengine.berkeley.edu/api/layers/reserves/features/?page_size=500',
  jepson: 'https://dev-ecoengine.berkeley.edu/api/layers/jepson-regions/features/?page_size=500'
};

ECO.basemaps = {
  'Light': {
    'url': 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    'attribution': 'Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.'
  },
  'Dark': {
    'url': 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
    'attribution': 'Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.'
  },
  'OpenStreetMap': {
    'url': 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'attribution': '© <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  },
  'Stamen Terrain': {
    'url': 'http://{s}.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg',
    'attribution': 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
  }
};

ECO.advancedSearch = [
  {
    'section': 'Unique Identifier (Observations)',
    'fields': [
      {
        'field': 'catalog_number__exact',
        'type': 'text'
      },
      {
        'field': 'collection_code',
        'type': 'text'
      },
      {
        'field': 'institution_code',
        'type': 'text'
      }
    ]
  },
  {
    'section': 'Higher Geography',
    'fields': [
      {
        'field': 'country',
        'type': 'text'
      },
      {
        'field': 'state_province',
        'type': 'text'
      },
      {
        'field': 'county',
        'type': 'text'
      },
      {
        'field': 'locality',
        'type': 'text'
      },
    ]
  },
  /*
  {
    'section': 'Time',
    'fields': [
      {
        'field': 'begin_date',
        'type': 'text',
        'placeholder': '1920-01-01'
      },
      {
        'field': 'end_date',
        'type': 'text',
        'placeholder': '2010-11-25'
      }
    ]
  },
  */
  {
    'section': 'Geologic Strata',
    'fields': [
      {
        'field': 'earliest_period_or_lowest_system',
        'type': 'text'
      },
      {
        'field': 'latest_period_or_highest_system',
        'type': 'text'
      },
      {
        'field': 'maximum_depth_in_meters',
        'type': 'text'
      },
      {
        'field': 'minimum_depth_in_meters',
        'type': 'text'
      }
    ]
  },
  {
    'section': 'Taxonomy',
    'fields': [
      {
        'field': 'kingdom',
        'type': 'text'
      },
      {
        'field': 'phylum',
        'type': 'text'
      },
      {
        'field': 'clss',
        'type': 'text'
      },
      {
        'field': 'order',
        'type': 'text'
      },
      {
        'field': 'family',
        'type': 'text'
      },
      {
        'field': 'genus',
        'type': 'text'
      },
      {
        'field': 'specific_epithet',
        'type': 'text'
      },
      {
        'field': 'infraspecific_epithet',
        'alias': 'subspecies',
        'type': 'text'
      },
      {
        'field': 'scientific_name',
        'type': 'text'
      }
    ]
  },
  /*
  {
    'section': 'Metadata',
    'fields': [
      {
        'field': 'authors',
        'field': 'photographer',
        'type': 'text'
      }
    ]
  }
  */
];
