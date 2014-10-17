var ECO = ECO || {};

ECO.advancedSearch = [
  {
    'section': 'Unique Identifier (Observations)',
    'fields': [
      {
        'field': 'catalog_number',
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

ECO.iconColors = {
  'specimen': 'red',
  'vtm vegetation feature': 'green',
  'plot survey': 'blue',
  'photo': 'pink',
  'fossil': 'purple',
  'observation': 'orange',
  'checklist': 'magenta'
};
