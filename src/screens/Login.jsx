import { Button, Stack, TextField } from "@mui/joy";
import { Card, Divider, IconButton, Tooltip, Typography } from "@mui/joy";
import {
  Check,
  EmailOutlined,
  Error,
  Google,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  checkUserExists,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  signInWithGoogle
} from "$utils/firebase";
import { useEffect, useRef, useState } from "react";

import BasicFadeModal from "$modals/BasicFadeModal";
import { CssVarsProvider } from "@mui/joy/styles";
import { Fade } from "$utils/transitions";
import useDebounce from "$hooks/useDebounce";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const debouncedEmail = useDebounce(email, 500);
  const debouncedUserExists = useDebounce(userExists, 500);
  const debouncedPassword = useDebounce(password, 1000);

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

  // check if password is valid (at least 6 characters and contains at least one number and one letter) allow special characters
  const passwordIsValid = (password) => {
    var hasNumber = /\d/;
    var hasLetter = /[a-zA-Z]/;
    return (password.length >= 6 && hasNumber.test(password) && hasLetter.test(password));
  };

  async function check(email) {
    const userExists = await checkUserExists(email);
    setUserExists(userExists);
  }

  const signInButtonText = () => {
    const validEmail = emailIsValid(debouncedEmail);
    if (!validEmail) {
      return "Enter a valid email";
    } else if (!passwordIsValid(password)) {
      return "Enter a valid password";
    } else if (validEmail && debouncedUserExists) {
      return "Sign In";
    } else if (validEmail && !debouncedUserExists) {
      return "Sign up";
    }
  };

  const onEmailCTAClick = () => {
    if (signInButtonText() === "Sign In") {
      logInWithEmailAndPassword({ email: debouncedEmail, password: debouncedPassword });
    } else if (signInButtonText() === "Sign up") {
      registerWithEmailAndPassword({ email: debouncedEmail, password: debouncedPassword });
    }
  };

  const onResetPasswordClick = () => {
    if (emailIsValid(email)) {
      sendPasswordReset(email);
    } else {
      setAlertOpen(true);
    }
  };

  return (
    <div>
      <CssVarsProvider>
        <div className="App-header">
          <BasicFadeModal
            open={alertOpen}
            setOpen={setAlertOpen}
            message="Please enter your email address in order to reset your password"
            title="Missing email address"
          />
          <Card sx={{ width: 260 }}>
            <Typography component={"h1"} fontSize="lg">
              Welcome to RIS Auctions
            </Typography>
            <Divider />
            <Stack spacing={1} mt={2}>
              <TextField
                startDecorator={
                  <IconButton size="lg" disabled>
                    <EmailOutlined fontSize="small" color="primary" />
                  </IconButton>
                }
                id="email"
                placeholder="email"
                type={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
                autoFocus
                required
              />

              <Fade in={emailIsValid(email)} nodeRef={nodeRef}>
                <TextField
                  id="password"
                  placeholder="password"
                  ref={nodeRef}
                  required
                  type={showPassword ? "text" : "password"}
                  size="sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => { e.key === "Enter" && onEmailCTAClick() }}
                  startDecorator={
                    <IconButton
                      variant="plain"
                      size="lg"
                      color="primary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOutlined />
                      ) : (
                        <VisibilityOffOutlined />
                      )}{" "}
                    </IconButton>
                  }
                  endDecorator={
                    debouncedPassword.length > 0 ? (
                      <>
                        {passwordIsValid(debouncedPassword) ? (
                          <Check color="success" />
                        ) : (
                          <Tooltip
                            title="Password must contain at least 6 characters, one number, one letter"
                            placement="top"
                          >
                            <Error color="danger" />
                          </Tooltip>
                        )}
                      </>
                    ) : null
                  }
                />
              </Fade>
              <Button
                variant="solid"
                onClick={onEmailCTAClick}
                size="sm"
                disabled={!signInButtonText().includes("Sign")}
              >
                {signInButtonText()}
              </Button>
              <Button
                variant="text"
                onClick={onResetPasswordClick}
                size="xs"
              >
                <Typography
                  level="body4"
                  color="neutral"
                  style={{ textDecoration: "underline" }}
                >
                  Forgot Password
                </Typography>
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
