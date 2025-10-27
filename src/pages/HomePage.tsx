const HomePage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">Welcome to New Project</h1>
          <p className="lead">
            A React + TypeScript + Vite application with Redux Toolkit, React Router, and Axios.
          </p>
          <div className="mt-4">
            <a href="/dashboard" className="btn btn-primary btn-lg me-2">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
