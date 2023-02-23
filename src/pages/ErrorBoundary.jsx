import { Component } from "react";

import { BsExclamationCircleFill } from "react-icons/bs";

import Button from "components/Button";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    triesNumber: 0,
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Planning to use a tracking error system like trackjs, Sentry
    console.error(error, errorInfo);
  }

  tryAgainHandler = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      triesNumber: prevState.triesNumber + 1,
    }));
  };

  render() {
    return this.state.hasError ? (
      <div className="mx-auto flex h-full w-full max-w-xs flex-col items-center justify-center gap-4 p-4 pt-16 text-center dark:text-primary-200">
        <BsExclamationCircleFill size={60} className="text-error" />
        <h2 className="text-xl">Oops! Something went wrong.</h2>
        <p className="mt-2 text-sm text-red-600">
          {this.state.error?.toString()}
        </p>
        {this.state.triesNumber < 3 ? (
          <Button
            onClick={this.tryAgainHandler}
            className="w-full max-w-[12rem]"
          >
            Try again
          </Button>
        ) : (
          <p className="text-sm text-red-600">
            The error persists. Please try refreshing the page or{" "}
            <a
              href="mailto:mohamedweb85@gmail.com?subject=Error happened while using Rosie chat"
              className="font-semibold text-info hover:underline"
            >
              Contact Support.
            </a>
          </p>
        )}
      </div>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
