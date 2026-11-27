import ServiceDetail from '../../components/ServiceDetail.jsx';
import usePageTitle from '../../hooks/usePageTitle.js';

export default function ExpressShipping() {
  usePageTitle('Express Shipping');

  return (
    <ServiceDetail
      slug="express-shipping"
      number="02"
      title="Express Shipping"
      lead="Fast-priority delivery for urgent packages."
      intro="Fast-priority international delivery for customers who need their packages shipped urgently. Your parcel moves with priority handling through our express carrier partners — with a tracking number from the moment it leaves our hands."
      // TODO: main photo should be '/images/ups-yellow-box.jpg' (800×1000) once uploaded.
      photo={{
        src: '/images/fragile-bale-trolley.jpg',
        alt: 'Boxes and fragile items wrapped and secured for express shipping on a trolley',
        width: 952,
        height: 1269,
      }}
      facts={[
        { label: 'DHL', value: '2–5 business days' },
        { label: 'UPS', value: '5–8 business days' },
        { label: 'Aramex', value: '5–8 business days' },
        { label: 'FedEx', value: '7–10 business days' },
      ]}
      benefits={[
        { title: 'Priority handling', body: 'Express shipments are processed first at every stage — booking, dispatch and customs.' },
        { title: '220+ countries and territories', body: 'Express is our only service that reaches all 220+ destinations — see the Destinations page.' },
        { title: 'Carrier tracking', body: 'Every express shipment carries a tracking number you can follow end to end.' },
        { title: 'Trusted carriers', body: 'Your urgent packages travel with established international carriers: DHL, UPS, Aramex and FedEx.' },
      ]}
      process={[
        { title: 'Book your shipment', body: 'Start online or chat with us — tell us what you are sending and where it is going.' },
        { title: 'Prepare your package', body: 'Pack securely and clearly. We advise on packaging requirements for international transit.' },
        { title: 'Drop off or arrange collection', body: 'Bring your parcel to our Abuja or Lagos drop-off points, or arrange package collection.' },
        { title: 'Track your shipment', body: 'Follow every milestone with your tracking number — booking to delivery.' },
        { title: 'Receive your package', body: 'Your shipment arrives safely at its destination.' },
      ]}
      extraPhotos={[
        {
          src: '/images/boxes-wide-truck.jpg',
          alt: 'Taped shipping boxes lined up beside a truck, ready for an express dispatch',
          width: 1280,
          height: 591,
        },
      ]}
    />
  );
}
