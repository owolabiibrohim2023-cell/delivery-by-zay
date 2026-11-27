import usePageTitle from '../../hooks/usePageTitle.js';
import BookingWizard from '../../components/BookingWizard.jsx';

export default function DashboardBook() {
  usePageTitle('Book Shipment');
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Submit a booking request below. Once the DBZ team approves it, a tracking number is issued
        and the shipment appears in your My Shipments list.
      </p>
      <BookingWizard />
    </div>
  );
}
