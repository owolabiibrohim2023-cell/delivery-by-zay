import ServiceDetail from '../../components/ServiceDetail.jsx';
import usePageTitle from '../../hooks/usePageTitle.js';

export default function AirSeaCargo() {
  usePageTitle('Air & Sea Cargo');

  return (
    <ServiceDetail
      slug="air-sea-cargo"
      number="03"
      title="Air & Sea Cargo"
      lead="International cargo solutions for larger shipments."
      intro="International cargo solutions for larger shipments, bulk goods and consolidated consignments. Send by air when speed matters, or by sea when volume matters — our team advises the best route for your cargo."
      photo={{
        src: '/images/cargo-pallet-top.jpg',
        alt: 'Taped cargo boxes stacked on a pallet jack ready for shipment',
        width: 591,
        height: 1156,
      }}
      facts={[
        { label: 'Air cargo transit', value: '10–15 business days', note: 'Every air cargo option includes a tracking ID.' },
        { label: 'Sea cargo transit', value: '6–8 weeks after departure' },
        { label: 'Air destinations', value: 'UK, USA, Canada, Europe and selected African countries', note: 'Libya, Kenya, Tanzania, Uganda and South Africa.' },
        { label: 'Sea destinations', value: 'United Kingdom' },
      ]}
      benefits={[
        { title: 'Air cargo', body: 'Larger shipments by air reach the UK, USA, Canada, Europe and selected African countries in 10–15 business days — with a tracking ID on every air option.' },
        { title: 'Sea cargo', body: 'Bulk goods and consolidated consignments to the United Kingdom by sea, arriving 6–8 weeks after departure.' },
        { title: 'Doorstep or warehouse pickup', body: 'UK air cargo is doorstep delivery only. USA cargo offers Houston warehouse pickup or doorstep delivery. Canada offers Ontario and Calgary warehouse pickup, or doorstep delivery.' },
        { title: 'Consolidated consignments', body: 'Combine goods into one consolidated shipment to move larger volumes efficiently.' },
      ]}
      process={[
        { title: 'Book your shipment', body: 'Start online or chat with us — tell us what you are sending and where it is going.' },
        { title: 'Prepare your package', body: 'Pack securely and clearly. We advise on packaging requirements for international transit.' },
        { title: 'Drop off or arrange collection', body: 'Bring your cargo to our Abuja or Lagos drop-off points, or arrange collection.' },
        { title: 'Track your shipment', body: 'Air cargo shipments carry a tracking ID; sea cargo milestones are shared by our team.' },
        { title: 'Receive your cargo', body: 'Doorstep delivery or warehouse pickup at the destination, depending on your route.' },
      ]}
      extraPhotos={[
        {
          src: '/images/uk-cargo-boxes.jpg',
          alt: 'Cartons of customer goods packed for shipment to the UK, USA and Canada',
          width: 720,
          height: 1280,
        },
        {
          src: '/images/boxes-wide-truck.jpg',
          alt: 'Taped shipping boxes lined up beside a truck before a cargo departure',
          width: 1280,
          height: 591,
        },
      ]}
    />
  );
}
