// DBZ destination data.
// Express Shipping reaches 220+ countries and territories (see countries.js).
// Air cargo and sea cargo reach a smaller set of destinations — listed here
// exactly as confirmed by the business. No prices or invented transit claims.

import { COUNTRIES } from './countries.js';

export const EXPRESS_DESTINATIONS = COUNTRIES.map(([, name]) => name);

export const AIR_CARGO_DESTINATIONS = [
  'United Kingdom',
  'United States',
  'Canada',
  'Europe',
  'Libya',
  'Kenya',
  'Tanzania',
  'Uganda',
  'South Africa',
];

export const SEA_CARGO_DESTINATIONS = ['United Kingdom'];

export const AIR_CARGO_NOTE =
  'Air cargo: UK, USA, Canada, Europe and selected African countries. Sea cargo: UK only.';
