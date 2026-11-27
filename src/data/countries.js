// DBZ shipping destinations — [ISO code, name, region].
// Over 220 countries & territories are supported. Flag emojis are derived
// from the ISO code at render time. No prices or transit times are stored:
// rates are only provided by the business through official quotations.

export const REGIONS = [
  'Africa',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Oceania',
];

export const FEATURED = ['GB', 'US', 'CA'];

export const COUNTRIES = [
  ['AF','Afghanistan','Asia'],['AL','Albania','Europe'],['DZ','Algeria','Africa'],['AD','Andorra','Europe'],
  ['AO','Angola','Africa'],['AI','Anguilla','North America'],['AG','Antigua & Barbuda','North America'],
  ['AR','Argentina','South America'],['AM','Armenia','Asia'],['AW','Aruba','North America'],
  ['AU','Australia','Oceania'],['AT','Austria','Europe'],['AZ','Azerbaijan','Asia'],
  ['BS','Bahamas','North America'],['BH','Bahrain','Asia'],['BD','Bangladesh','Asia'],
  ['BB','Barbados','North America'],['BY','Belarus','Europe'],['BE','Belgium','Europe'],
  ['BZ','Belize','North America'],['BJ','Benin','Africa'],['BM','Bermuda','North America'],
  ['BT','Bhutan','Asia'],['BO','Bolivia','South America'],['BQ','Bonaire','North America'],
  ['BA','Bosnia & Herzegovina','Europe'],['BW','Botswana','Africa'],['BR','Brazil','South America'],
  ['VG','British Virgin Islands','North America'],['BN','Brunei','Asia'],['BG','Bulgaria','Europe'],
  ['BF','Burkina Faso','Africa'],['BI','Burundi','Africa'],['KH','Cambodia','Asia'],
  ['CM','Cameroon','Africa'],['CA','Canada','North America'],['CV','Cape Verde','Africa'],
  ['KY','Cayman Islands','North America'],['CF','Central African Republic','Africa'],
  ['TD','Chad','Africa'],['CL','Chile','South America'],['CN','China','Asia'],
  ['CO','Colombia','South America'],['KM','Comoros','Africa'],['CG','Congo (Brazzaville)','Africa'],
  ['CD','Congo (Kinshasa)','Africa'],['CK','Cook Islands','Oceania'],['CR','Costa Rica','North America'],
  ['CI','Côte d’Ivoire','Africa'],['HR','Croatia','Europe'],['CU','Cuba','North America'],
  ['CW','Curaçao','North America'],['CY','Cyprus','Europe'],['CZ','Czechia','Europe'],
  ['DK','Denmark','Europe'],['DJ','Djibouti','Africa'],['DM','Dominica','North America'],
  ['DO','Dominican Republic','North America'],['EC','Ecuador','South America'],['EG','Egypt','Africa'],
  ['SV','El Salvador','North America'],['GQ','Equatorial Guinea','Africa'],['ER','Eritrea','Africa'],
  ['EE','Estonia','Europe'],['SZ','Eswatini','Africa'],['ET','Ethiopia','Africa'],
  ['FK','Falkland Islands','South America'],['FO','Faroe Islands','Europe'],['FJ','Fiji','Oceania'],
  ['FI','Finland','Europe'],['FR','France','Europe'],['GF','French Guiana','South America'],
  ['PF','French Polynesia','Oceania'],['GA','Gabon','Africa'],['GM','Gambia','Africa'],
  ['GE','Georgia','Asia'],['DE','Germany','Europe'],['GH','Ghana','Africa'],
  ['GI','Gibraltar','Europe'],['GR','Greece','Europe'],['GL','Greenland','North America'],
  ['GD','Grenada','North America'],['GP','Guadeloupe','North America'],['GU','Guam','Oceania'],
  ['GT','Guatemala','North America'],['GG','Guernsey','Europe'],['GN','Guinea','Africa'],
  ['GW','Guinea-Bissau','Africa'],['GY','Guyana','South America'],['HT','Haiti','North America'],
  ['HN','Honduras','North America'],['HK','Hong Kong','Asia'],['HU','Hungary','Europe'],
  ['IS','Iceland','Europe'],['IN','India','Asia'],['ID','Indonesia','Asia'],
  ['IR','Iran','Asia'],['IQ','Iraq','Asia'],['IE','Ireland','Europe'],
  ['IM','Isle of Man','Europe'],['IL','Israel','Asia'],['IT','Italy','Europe'],
  ['JM','Jamaica','North America'],['JP','Japan','Asia'],['JE','Jersey','Europe'],
  ['JO','Jordan','Asia'],['KZ','Kazakhstan','Asia'],['KE','Kenya','Africa'],
  ['KI','Kiribati','Oceania'],['KR','South Korea','Asia'],['KW','Kuwait','Asia'],
  ['KG','Kyrgyzstan','Asia'],['LA','Laos','Asia'],['LV','Latvia','Europe'],
  ['LB','Lebanon','Asia'],['LS','Lesotho','Africa'],['LR','Liberia','Africa'],
  ['LY','Libya','Africa'],['LI','Liechtenstein','Europe'],['LT','Lithuania','Europe'],
  ['LU','Luxembourg','Europe'],['MO','Macau','Asia'],['MG','Madagascar','Africa'],
  ['MW','Malawi','Africa'],['MY','Malaysia','Asia'],['MV','Maldives','Asia'],
  ['ML','Mali','Africa'],['MT','Malta','Europe'],['MQ','Martinique','North America'],
  ['MR','Mauritania','Africa'],['MU','Mauritius','Africa'],['YT','Mayotte','Africa'],
  ['MX','Mexico','North America'],['MD','Moldova','Europe'],['MC','Monaco','Europe'],
  ['MN','Mongolia','Asia'],['ME','Montenegro','Europe'],['MS','Montserrat','North America'],
  ['MA','Morocco','Africa'],['MZ','Mozambique','Africa'],['MM','Myanmar','Asia'],
  ['NA','Namibia','Africa'],['NR','Nauru','Oceania'],['NP','Nepal','Asia'],
  ['NL','Netherlands','Europe'],['NC','New Caledonia','Oceania'],['NZ','New Zealand','Oceania'],
  ['NI','Nicaragua','North America'],['NE','Niger','Africa'],['NG','Nigeria','Africa'],
  ['MK','North Macedonia','Europe'],['NO','Norway','Europe'],['OM','Oman','Asia'],
  ['PK','Pakistan','Asia'],['PW','Palau','Oceania'],['PS','Palestinian Territories','Asia'],
  ['PA','Panama','North America'],['PG','Papua New Guinea','Oceania'],['PY','Paraguay','South America'],
  ['PE','Peru','South America'],['PH','Philippines','Asia'],['PL','Poland','Europe'],
  ['PT','Portugal','Europe'],['PR','Puerto Rico','North America'],['QA','Qatar','Asia'],
  ['RE','Réunion','Africa'],['RO','Romania','Europe'],['RU','Russia','Europe'],
  ['RW','Rwanda','Africa'],['BL','Saint Barthélemy','North America'],['KN','Saint Kitts & Nevis','North America'],
  ['LC','Saint Lucia','North America'],['MF','Saint Martin','North America'],['VC','Saint Vincent & the Grenadines','North America'],
  ['WS','Samoa','Oceania'],['SM','San Marino','Europe'],['ST','São Tomé & Príncipe','Africa'],
  ['SA','Saudi Arabia','Asia'],['SN','Senegal','Africa'],['RS','Serbia','Europe'],
  ['SC','Seychelles','Africa'],['SL','Sierra Leone','Africa'],['SG','Singapore','Asia'],
  ['SX','Sint Maarten','North America'],['SK','Slovakia','Europe'],['SI','Slovenia','Europe'],
  ['SB','Solomon Islands','Oceania'],['SO','Somalia','Africa'],['ZA','South Africa','Africa'],
  ['SS','South Sudan','Africa'],['ES','Spain','Europe'],['LK','Sri Lanka','Asia'],
  ['SD','Sudan','Africa'],['SR','Suriname','South America'],['SE','Sweden','Europe'],
  ['CH','Switzerland','Europe'],['SY','Syria','Asia'],['TW','Taiwan','Asia'],
  ['TJ','Tajikistan','Asia'],['TZ','Tanzania','Africa'],['TH','Thailand','Asia'],
  ['TL','Timor-Leste','Asia'],['TG','Togo','Africa'],['TO','Tonga','Oceania'],
  ['TT','Trinidad & Tobago','North America'],['TN','Tunisia','Africa'],['TR','Türkiye','Asia'],
  ['TM','Turkmenistan','Asia'],['TC','Turks & Caicos Islands','North America'],['TV','Tuvalu','Oceania'],
  ['UG','Uganda','Africa'],['UA','Ukraine','Europe'],['AE','United Arab Emirates','Asia'],
  ['GB','United Kingdom','Europe'],['US','United States','North America'],['UY','Uruguay','South America'],
  ['UZ','Uzbekistan','Asia'],['VU','Vanuatu','Oceania'],['VA','Vatican City','Europe'],
  ['VE','Venezuela','South America'],['VN','Vietnam','Asia'],['WF','Wallis & Futuna','Oceania'],
  ['YE','Yemen','Asia'],['ZM','Zambia','Africa'],['ZW','Zimbabwe','Africa'],
];

export function flagEmoji(code) {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0))
  );
}

export function countryByCode(code) {
  return COUNTRIES.find((c) => c[0] === code) || null;
}

export const FEATURED_COUNTRIES = FEATURED.map((code) => {
  const c = countryByCode(code);
  return { code: c[0], name: c[1], region: c[2] };
});
