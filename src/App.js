import "./App.css";

import { Alert, CircularProgress } from "@mui/joy";

import Auction from "./screens/Auction";
import { CssVarsProvider } from "@mui/joy/styles";
import Login from "./screens/Login";
import { auth } from "./utils/firebase";
import background from "./assets/background.jpg";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <CssVarsProvider defaultMode="system">
      {!user && (
        <div className="bg">
          <img
            className="bg"
            src={background}
            crossOrigin="Anonymous"
            alt="background"
          />
        </div>
      )}
      {error && <Alert>{error}</Alert>}
      {loading && (
        <div className="App-header">
          <CircularProgress />
        </div>
      )}
      {user ? <Auction /> : <Login />}
    </CssVarsProvider>
  );
}

export default App;
