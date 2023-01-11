import { CssVarsProvider } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import { signInWithGoogle } from "../firebase";
import { Card, Typography, Divider } from "@mui/joy";

export const Login = () => {
  return (
    <div>
      <CssVarsProvider>
        <div className="App-header">
          <Card>
            <Typography component={"h1"} fontSize="lg">
              Welcome to RIS Auction house
            </Typography>
            <Divider />
            <Button
              sx={{ marginTop: 4 }}
              variant="solid"
              onClick={signInWithGoogle}
            >
              Sign In with google
            </Button>
          </Card>
        </div>
      </CssVarsProvider>
    </div>
  );
};

export default Login;
