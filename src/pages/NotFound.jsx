import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.js';
import Button from '../components/Button.jsx';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink text-white">
      <span className="ghost-word bottom-0 left-1/2 -translate-x-1/2 text-[30vw]" aria-hidden="true">
        404
      </span>
      <div className="relative z-10 px-6 text-center">
        <span className="eyebrow eyebrow--light">Lost in transit</span>
        <h1 className="h-display mt-6 text-6xl md:text-8xl">
          This page <span className="text-brand">couldn’t be delivered.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[14.5px] leading-relaxed text-white/55">
          The page you are looking for does not exist or has moved. Let’s get you back on route.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button to="/" arrow>Back to home</Button>
          <Button to="/track" variant="ghost-light">Track a shipment</Button>
        </div>
      </div>
    </div>
  );
}
