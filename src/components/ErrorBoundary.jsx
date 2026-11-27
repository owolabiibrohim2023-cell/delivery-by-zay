import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('DBZ UI error:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
          <div className="h-3 w-3 bg-brand" />
          <h1 className="h-display mt-6 text-4xl">Something went wrong.</h1>
          <p className="mt-3 max-w-md text-ink/60">
            An unexpected error occurred while rendering this page. Please refresh, or head back to
            the homepage.
          </p>
          <pre className="mt-6 max-w-lg overflow-auto rounded-xl bg-mist p-4 text-left font-mono text-[11px] text-ink/60">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div className="mt-8 flex gap-3">
            <button className="btn-dark" onClick={() => window.location.reload()}>
              Refresh
            </button>
            <Link className="btn-outline" to="/">
              Back home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
