import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      {/* Show alert notifications */}
      <ReactNotifications />
    </>
  );
};

export default App;
