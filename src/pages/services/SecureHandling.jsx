import ServiceDetail from '../../components/ServiceDetail.jsx';
import usePageTitle from '../../hooks/usePageTitle.js';

export default function SecureHandling() {
  usePageTitle('Secure Package Handling');

  return (
    <ServiceDetail
      slug="secure-handling"
      number="04"
      title="Secure Package Handling"
      lead="Careful handling at every stage of the journey."
      intro="Careful, professional handling with proper documentation at every stage of the journey. From the moment your package reaches our counter it is weighed, documented, packed securely and tracked — so it arrives exactly as it left you."
      photo={{
        src: '/images/packing-staff-dbz-sign.jpg',
        alt: 'Staff member packing a customer box under the DBZ sign',
        width: 591,
        height: 1052,
      }}
      benefits={[
        { title: 'Weighed and documented', body: 'Every package is weighed and documented at drop-off, with the details recorded on your booking.' },
        { title: 'Secure packing', body: 'Fragile and sensitive items are wrapped and secured for international transit — we advise on packaging requirements.' },
        { title: 'Tracked end to end', body: 'A unique tracking number follows your package from booking to delivery.' },
        { title: 'Accountable team', body: 'Real people handle your shipment at our Abuja and Lagos locations, and real people answer when you call.' },
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
