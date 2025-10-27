import { ErrorType } from "./types";

interface ErrorPageProps {
  errorType: ErrorType;
}

export const ErrorPage = ({ errorType }: ErrorPageProps) => {
  const getErrorMessage = () => {
    switch (errorType) {
      case ErrorType.NotFound:
        return {
          title: "404 - Page Not Found",
          message: "The page you are looking for does not exist.",
        };
      case ErrorType.PermissionDenied:
        return {
          title: "403 - Permission Denied",
          message: "You do not have permission to access this page.",
        };
      case ErrorType.NotAuthorized:
        return {
          title: "401 - Not Authorized",
          message: "You are not authorized to access this page.",
        };
      case ErrorType.InternalServerError:
        return {
          title: "500 - Internal Server Error",
          message: "An internal server error occurred.",
        };
      default:
        return {
          title: "Error",
          message: "An error occurred.",
        };
    }
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 text-center">
          <h1 className="display-1 fw-bold">{errorType}</h1>
          <h2 className="mb-4">{title}</h2>
          <p className="lead mb-4">{message}</p>
          <a href="/" className="btn btn-primary">
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};
