var ECO = ECO || {};

ECO.endpoints = {
  search: 'https://ecoengine.berkeley.edu/api/search/',
  observations: 'https://ecoengine.berkeley.edu/api/observations/',
  photos: 'https://ecoengine.berkeley.edu/api/photos/',
  sensors: 'https://ecoengine.berkeley.edu/api/sensors/?page_size=5000&format=geojson',
  layers: 'https://ecoengine.berkeley.edu/api/layers/',
  rasters: 'https://ecoengine.berkeley.edu/api/series/tasmin_ens-avg_amon_rcp85/rasters/',
  reserves: 'https://ecoengine.berkeley.edu/api/layers/reserves/features/?ordering=name&page_size=100',
  jepson: 'https://ecoengine.berkeley.edu/api/layers/jepson-regions/features/?ordering=name&page_size=100'
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

ECO.rasterPicker = {
  "models": [
    {
      "name": "modern",
      "slug": "historical"
    },
    {
      "name": "RCP 4.5",
      "slug": "rcp45"
    },
    {
      "name": "RCP 8.5",
      "slug": "rcp85"
    }
  ],
  "metrics": [
    {
      "name": "precipitation yearly maximum allmodels",
      "slug": "pr_models_max"
    },
    {
      "name": "precipitation yearly minimum allmodels",
      "slug": "pr_models_min"
    },
    {
      "name": "precipitation yearly average ACCESS1-0",
      "slug": "pr_yr_avg_ACCESS1-0"
    },
    {
      "name": "precipitation yearly average CanESM2",
      "slug": "pr_yr_avg_CanESM2"
    },
    {
      "name": "precipitation yearly average CCSM4",
      "slug": "pr_yr_avg_CCSM4"
    },
    {
      "name": "precipitation yearly average CESM1-BGC",
      "slug": "pr_yr_avg_CESM1-BGC"
    },
    {
      "name": "precipitation yearly average CMCC-CMS",
      "slug": "pr_yr_avg_CMCC-CMS"
    },
    {
      "name": "precipitation yearly average CNRM-CM5",
      "slug": "pr_yr_avg_CNRM-CM5"
    },
    {
      "name": "precipitation yearly average GFDL-CM3",
      "slug": "pr_yr_avg_GFDL-CM3"
    },
    {
      "name": "precipitation yearly average HadGEM2-CC",
      "slug": "pr_yr_avg_HadGEM2-CC"
    },
    {
      "name": "precipitation yearly average HadGEM2-ES",
      "slug": "pr_yr_avg_HadGEM2-ES"
    },
    {
      "name": "precipitation yearly average MIROC5",
      "slug": "pr_yr_avg_MIROC5"
    },
    {
      "name": "precipitation yearly average",
      "slug": "pr_yr_ens-avg_amon",
      "nex": true
    },
    {
      "name": "maximum temperature ensemble average",
      "slug": "tasmax_ens-avg_amon",
      "nex": true
    },
    {
      "name": "maximum temperature yearly maximum allmodels",
      "slug": "tasmax_models_max"
    },
    {
      "name": "maximum temperature yearly minimum allmodels",
      "slug": "tasmax_models_min"
    },
    {
      "name": "maximum temperature yearly average ACCESS1-0",
      "slug": "tasmax_yr_avg_ACCESS1-0"
    },
    {
      "name": "maximum temperature yearly average",
      "slug": "tasmax_yr_ens-avg_amon",
      "nex": true
    },
    {
      "name": "minimum temperature yearly average",
      "slug": "tasmin_yr_ens-avg_amon",
      "nex": true
    },
    {
      "name": "minimum temperature ensemble average",
      "slug": "tasmin_ens-avg_amon",
      "nex": true
    }
  ]
};
