import ServiceDetail from '../../components/ServiceDetail.jsx';
import usePageTitle from '../../hooks/usePageTitle.js';

export default function InternationalShipping() {
  usePageTitle('International Shipping');

  return (
    <ServiceDetail
      slug="international-shipping"
      number="01"
      title="International Shipping"
      lead="Door-to-door delivery and warehouse pickup, worldwide."
      intro="Reliable parcel and package shipping from Nigeria to destinations worldwide. Choose doorstep delivery or pickup from our partner warehouses abroad — whatever suits you and whoever you are shipping to."
      photo={{
        src: '/images/dbz-counter-scale.jpg',
        alt: 'Customer parcels and packages at the DBZ counter with the weighing scale',
        width: 591,
        height: 1044,
      }}
      facts={[
        { label: 'Coverage', value: '220+ countries and territories', note: 'Available through our partner network — see the Destinations page.' },
        { label: 'Delivery options', value: 'Doorstep delivery or warehouse pickup' },
        { label: 'Sending from', value: 'Abuja and Lagos drop-off points' },
        { label: 'Tracking', value: 'Tracking number on every shipment' },
      ]}
      benefits={[
        { title: 'Doorstep delivery', body: 'Your package is delivered directly to the address you provide, wherever the destination allows it.' },
        { title: 'Warehouse pickup', body: 'For selected destinations, your package can be held at a partner warehouse for you or your receiver to collect.' },
        { title: 'Proper documentation', body: 'Every shipment is documented correctly from drop-off, so it moves smoothly through international transit.' },
        { title: 'Shipment tracking', body: 'A unique tracking number lets you follow your package from booking to delivery.' },
      ]}
      process={[
        { title: 'Book your shipment', body: 'Start online or chat with us — tell us what you are sending and where it is going.' },
        { title: 'Prepare your package', body: 'Pack securely and clearly. We advise on packaging requirements for international transit.' },
        { title: 'Drop off or arrange collection', body: 'Bring your parcel to our Abuja or Lagos drop-off points, or arrange package collection.' },
        { title: 'Track your shipment', body: 'Follow every milestone with your tracking number — booking to delivery.' },
        { title: 'Receive your package', body: 'Your shipment arrives safely at its destination.' },
      ]}
    />
  );
}
