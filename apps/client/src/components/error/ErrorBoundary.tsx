"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error only in development mode
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4">
          <div className="max-w-lg w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-6 p-4 rounded-full bg-red-500/20 border-2 border-red-500">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-3">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-gray-300 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
                Try refreshing the page or go back to the dashboard.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="w-full mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm font-mono text-red-300 text-left whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </button>
              </div>

              {/* Support Link */}
              <p className="mt-6 text-sm text-gray-400">
                If this problem persists, please{" "}
                <a
                  href="mailto:support@hypehouse.com"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

