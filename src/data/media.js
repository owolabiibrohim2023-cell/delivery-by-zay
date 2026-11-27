// DBZ brand media assets and business information.

export const BUSINESS = {
  name: 'DBZ – Delivered by Zay',
  shortName: 'DBZ',
  tagline: 'Your trusted shipping partner.',
  slogan: 'Fast. Safe. Reliable.',
  email: 'deliveredbyzay@gmail.com',
  phone: '08149748188',
  phoneIntl: '+234 814 974 8188',
  whatsapp: '+2347012995971',
  whatsappLink: 'https://wa.me/2347012995971',
  instagram: '@deliveredby_zay',
  instagramLink: 'https://instagram.com/deliveredby_zay',
  locations: [
    {
      id: 'abuja',
      city: 'Abuja',
      name: 'DBZ Abuja Office',
      address: 'Shop C2-10, Central Market, Kubwa, Abuja',
      mapsQuery: '584C+RF Kubwa, Abuja',
    },
    {
      id: 'lagos',
      city: 'Lagos',
      name: 'DBZ Lagos Office',
      address: 'NAHCO Export Warehouse, Murtala Muhammed International Airport, Ikeja, Lagos',
      mapsQuery: 'NAHCO Export Warehouse, Murtala Muhammed International Airport, Ikeja, Lagos',
    },
  ],
};

export function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
