import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { useAuthRestore } from "./hooks/useAuthRestore";

// Component để wrap Router và sử dụng hooks
const AppContent = () => {
  // Restore authentication state when page reloads
  useAuthRestore();

  return <Router />;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>

      {/* Show alert notifications */}
      <ReactNotifications />
    </>
  );
};

export default App;
