import { Card, Divider, Typography } from "@mui/joy";
import { Email, Google, Password } from "@mui/icons-material";
import { Fade, Slide } from "../utils/transitions";
import { Stack, TextField } from "@mui/joy";
import { checkUserExists, signInWithGoogle } from "../utils/firebase";
import { useEffect, useRef, useState } from "react";

import Button from "@mui/joy/Button";
import { CssVarsProvider } from "@mui/joy/styles";
import { fade } from "../utils/transitions";
import { signInWithEmailAndPassword } from "firebase/auth";
import useDebounce from "../hooks/useDebounce";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(false);

  const debouncedEmail = useDebounce(email, 500);
  const debouncedUserExists = useDebounce(userExists, 500);

  // 1. email is value -> show password field
  // 2. email is valid -> check if user exists
  // 3. user exists -> show sign in button or sign up button

  const nodeRef = useRef(null);
  useEffect(() => {
    if (emailIsValid(debouncedEmail)) {
      setUserExists(check(debouncedEmail));
    }
  }, [debouncedEmail]);

  //check if email is valid
  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  async function check(email) {
    const userExists = await checkUserExists(email);
    setUserExists(userExists);
  }

  return (
    <div>
      <CssVarsProvider>
        <div className="App-header">
          <Card>
            <Typography component={"h1"} fontSize="lg">
              Welcome to RIS Auctions
            </Typography>
            <Divider />
            <Stack spacing={1} mt={2}>
              <TextField
                startDecorator={<Email fontSize="small" />}
                id="email"
                placeholder="email"
                type={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
                autoFocus
                required
              />

              <Fade in={debouncedEmail.length > 0} nodeRef={nodeRef}>
                <TextField
                  id="password"
                  placeholder="password"
                  ref={nodeRef}
                  required
                  type="password"
                  size="sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startDecorator={<Password fontSize="small" />}
                />
              </Fade>

              <Button
                variant="solid"
                // onClick={signInWithEmailAndPassword}
                size="sm"
                disabled={!emailIsValid(debouncedEmail) || password == ""}
              >
                {userExists ? "Sign In" : "Sign Up"}
              </Button>
            </Stack>
            <Typography level="body2" sx={{ textAlign: "center" }} my={1}>
              - OR -
            </Typography>
            <Button
              variant="solid"
              onClick={signInWithGoogle}
              startDecorator={<Google />}
              size="sm"
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
