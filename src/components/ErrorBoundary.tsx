import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-panel max-w-md w-full p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-300" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-text-primary">Something went wrong</h1>
            <p className="text-xs text-text-muted mt-1">
              {this.state.error?.message ?? 'An unexpected error occurred while rendering this page.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <a
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-soil-gold bg-soil-gold/15 border border-soil-gold/30 hover:bg-soil-gold/25 transition"
            >
              <Home className="w-3.5 h-3.5" /> Go Home
            </a>
            <button
              onClick={this.reset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-text-primary bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}