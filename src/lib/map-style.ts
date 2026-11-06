import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl'

/**
 * A light, Apple Maps–inspired vector style over OpenFreeMap's free
 * OpenMapTiles data (no API key): warm off-white land, soft green parks,
 * light blue water, white streets with yellow highways, quiet gray labels.
 */

const C = {
  land: '#f8f4ec',
  water: '#a4d3f3',
  waterLabel: '#4b82b8',
  park: '#cfe8b9',
  grass: '#d8eec6',
  wood: '#c6e3ae',
  wetland: '#d3ead6',
  sand: '#f3ead3',
  ice: '#ffffff',
  hospital: '#fbe3e1',
  school: '#f3ecdb',
  cemetery: '#dcebd0',
  pitch: '#d3ebc0',
  aeroway: '#eae7f0',
  runway: '#dcd8e6',
  building: '#ece7df',
  buildingOutline: '#ddd7cc',
  motorway: '#fcd682',
  motorwayCasing: '#e6b65a',
  trunk: '#fde3a7',
  trunkCasing: '#e9c47c',
  road: '#ffffff',
  roadCasing: '#e2dccf',
  path: '#ddd6c8',
  rail: '#d3cfc8',
  border: '#b6abc4',
  stateBorder: '#d2cadb',
  label: '#5f5f5f',
  labelStrong: '#2f2f2f',
  labelMuted: '#8a8580',
  parkLabel: '#4f8a3c',
  halo: '#ffffff',
} as const

const NAME: ExpressionSpecification = ['coalesce', ['get', 'name_en'], ['get', 'name']]
const REGULAR = ['Noto Sans Regular']
const BOLD = ['Noto Sans Bold']
const ITALIC = ['Noto Sans Italic']

/** Zoom-scaled line width: `stops` are [zoom, width] pairs. */
function width(...stops: [number, number][]): ExpressionSpecification {
  return ['interpolate', ['exponential', 1.5], ['zoom'], ...stops.flat()]
}

const notTunnel: ExpressionSpecification = ['!=', ['get', 'brunnel'], 'tunnel']

function classIs(...classes: string[]): ExpressionSpecification {
  return ['match', ['get', 'class'], classes, true, false]
}

interface RoadSpec {
  id: string
  classes: string[]
  minzoom: number
  fill: string
  casing: string
  widths: [number, number][]
}

const ROADS: RoadSpec[] = [
  {
    id: 'minor',
    classes: ['minor', 'service'],
    minzoom: 13,
    fill: C.road,
    casing: C.roadCasing,
    widths: [
      [13, 1],
      [16, 6],
      [20, 26],
    ],
  },
  {
    id: 'secondary',
    classes: ['secondary', 'tertiary'],
    minzoom: 9,
    fill: C.road,
    casing: C.roadCasing,
    widths: [
      [9, 0.8],
      [13, 3],
      [16, 9],
      [20, 34],
    ],
  },
  {
    id: 'primary',
    classes: ['primary'],
    minzoom: 7,
    fill: C.road,
    casing: C.roadCasing,
    widths: [
      [7, 0.8],
      [12, 3.5],
      [16, 11],
      [20, 40],
    ],
  },
  {
    id: 'trunk',
    classes: ['trunk'],
    minzoom: 5,
    fill: C.trunk,
    casing: C.trunkCasing,
    widths: [
      [5, 0.6],
      [12, 4],
      [16, 12],
      [20, 44],
    ],
  },
  {
    id: 'motorway',
    classes: ['motorway'],
    minzoom: 4,
    fill: C.motorway,
    casing: C.motorwayCasing,
    widths: [
      [4, 0.6],
      [12, 4.5],
      [16, 13],
      [20, 48],
    ],
  },
]

function roadLayers(): LayerSpecification[] {
  const casings: LayerSpecification[] = ROADS.map((road) => ({
    id: `road-${road.id}-casing`,
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: road.minzoom,
    filter: ['all', classIs(...road.classes), notTunnel],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': road.casing,
      'line-width': width(...road.widths.map(([z, w]): [number, number] => [z, w + 1.5])),
    },
  }))
  const fills: LayerSpecification[] = ROADS.map((road) => ({
    id: `road-${road.id}`,
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: road.minzoom,
    filter: ['all', classIs(...road.classes), notTunnel],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': road.fill, 'line-width': width(...road.widths) },
  }))
  return [...casings, ...fills]
}

function fill(
  id: string,
  sourceLayer: string,
  color: string,
  filter?: ExpressionSpecification,
  minzoom = 0,
): LayerSpecification {
  return {
    id,
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': sourceLayer,
    minzoom,
    ...(filter ? { filter } : {}),
    paint: { 'fill-color': color, 'fill-antialias': false },
  }
}

const textPaint = (color: string, haloWidth = 1.4) => ({
  'text-color': color,
  'text-halo-color': C.halo,
  'text-halo-width': haloWidth,
  'text-halo-blur': 0.5,
})

export const appleMapStyle: StyleSpecification = {
  version: 8,
  name: 'IKAS Apple-like',
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': C.land } },

    // Land cover and land use
    fill('landcover-sand', 'landcover', C.sand, classIs('sand')),
    fill('landcover-ice', 'landcover', C.ice, classIs('ice')),
    fill('landcover-grass', 'landcover', C.grass, classIs('grass')),
    fill('landcover-wood', 'landcover', C.wood, classIs('wood')),
    fill('landcover-wetland', 'landcover', C.wetland, classIs('wetland')),
    fill('park', 'park', C.park),
    fill('landuse-cemetery', 'landuse', C.cemetery, classIs('cemetery'), 12),
    fill('landuse-hospital', 'landuse', C.hospital, classIs('hospital'), 12),
    fill('landuse-school', 'landuse', C.school, classIs('school', 'university', 'college'), 12),
    fill('landuse-pitch', 'landuse', C.pitch, classIs('pitch', 'stadium', 'playground'), 13),

    // Water
    fill('water', 'water', C.water, ['!=', ['get', 'brunnel'], 'tunnel']),
    {
      id: 'waterway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'waterway',
      minzoom: 8,
      filter: notTunnel,
      layout: { 'line-cap': 'round' },
      paint: {
        'line-color': C.water,
        'line-width': width([8, 0.5], [13, 1.5], [18, 6]),
      },
    },

    // Airports
    fill('aeroway-area', 'aeroway', C.aeroway, ['==', ['geometry-type'], 'Polygon'], 10),
    {
      id: 'aeroway-runway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'aeroway',
      minzoom: 11,
      filter: classIs('runway', 'taxiway'),
      paint: {
        'line-color': C.runway,
        'line-width': width([11, 2], [15, 18], [18, 60]),
      },
    },

    // Buildings
    {
      id: 'building',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 14,
      paint: {
        'fill-color': C.building,
        'fill-outline-color': C.buildingOutline,
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
      },
    },

    // Paths and rail
    {
      id: 'path',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 15,
      filter: ['all', classIs('path', 'track'), notTunnel],
      paint: {
        'line-color': C.path,
        'line-dasharray': [2, 1.5],
        'line-width': width([15, 1], [18, 2.5]),
      },
    },
    {
      id: 'rail',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 12,
      filter: ['all', classIs('rail', 'transit'), notTunnel],
      paint: {
        'line-color': C.rail,
        'line-width': width([12, 1], [18, 3]),
      },
    },

    ...roadLayers(),

    // Boundaries
    {
      id: 'boundary-state',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      minzoom: 3,
      filter: ['all', ['==', ['get', 'admin_level'], 4], ['!=', ['get', 'maritime'], 1]],
      paint: {
        'line-color': C.stateBorder,
        'line-dasharray': [3, 2],
        'line-width': width([3, 0.6], [10, 1.4]),
      },
    },
    {
      id: 'boundary-country',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
      paint: {
        'line-color': C.border,
        'line-width': width([0, 0.6], [8, 1.6]),
      },
    },

    // Labels
    {
      id: 'water-label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'water_name',
      filter: ['==', ['geometry-type'], 'Point'],
      layout: {
        'text-field': NAME,
        'text-font': ITALIC,
        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 11, 12, 14],
        'text-max-width': 6,
        'text-letter-spacing': 0.05,
      },
      paint: { 'text-color': C.waterLabel, 'text-halo-color': C.water, 'text-halo-width': 0.6 },
    },
    {
      id: 'road-label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      minzoom: 13,
      filter: classIs('motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'service'),
      layout: {
        'symbol-placement': 'line',
        'text-field': NAME,
        'text-font': REGULAR,
        'text-size': ['interpolate', ['linear'], ['zoom'], 13, 10, 18, 13],
        'text-rotation-alignment': 'map',
      },
      paint: textPaint(C.label),
    },
    {
      id: 'park-label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'park',
      minzoom: 9,
      filter: ['==', ['geometry-type'], 'Point'],
      layout: {
        'text-field': NAME,
        'text-font': REGULAR,
        'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 15, 13],
        'text-max-width': 8,
      },
      paint: textPaint(C.parkLabel),
    },
    {
      id: 'place-neighbourhood',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 12,
      filter: classIs('suburb', 'neighbourhood', 'quarter'),
      layout: {
        'text-field': NAME,
        'text-font': BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 12, 9, 16, 12],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.12,
        'text-max-width': 8,
      },
      paint: textPaint(C.labelMuted),
    },
    {
      id: 'place-village',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 9,
      filter: classIs('village', 'hamlet'),
      layout: {
        'text-field': NAME,
        'text-font': REGULAR,
        'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 14, 13],
        'text-max-width': 8,
      },
      paint: textPaint(C.label),
    },
    {
      id: 'place-town',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 7,
      filter: classIs('town'),
      layout: {
        'text-field': NAME,
        'text-font': REGULAR,
        'text-size': ['interpolate', ['linear'], ['zoom'], 7, 11, 14, 15],
        'text-max-width': 8,
      },
      paint: textPaint(C.labelStrong),
    },
    {
      id: 'place-city',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 4,
      filter: classIs('city'),
      layout: {
        'text-field': NAME,
        'text-font': BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 11, 8, 14, 14, 19],
        'text-max-width': 8,
      },
      paint: textPaint(C.labelStrong, 1.6),
    },
    {
      id: 'place-state',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 4,
      maxzoom: 8,
      filter: classIs('state', 'province'),
      layout: {
        'text-field': NAME,
        'text-font': BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 9, 7, 12],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.15,
        'text-max-width': 8,
      },
      paint: textPaint(C.labelMuted),
    },
    {
      id: 'place-country',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      maxzoom: 8,
      filter: classIs('country'),
      layout: {
        'text-field': NAME,
        'text-font': BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 2, 11, 6, 15],
        'text-max-width': 8,
      },
      paint: textPaint(C.labelStrong, 1.6),
    },
  ],
}
