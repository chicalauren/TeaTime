import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "../utils/mutations";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loginMutation] = useMutation(LOGIN);
  const client = useApolloClient();

  const [loginInput, setLoginInput] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({
        variables: { login: loginInput, password },
      });

      localStorage.setItem("id_token", data.login.token);
      localStorage.setItem("username", data.login.user.username);

      await client.resetStore();
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMessage("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Email or Username"
          value={loginInput}
          required
          onChange={(e) => setLoginInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <p>
          Forgot password?{" "}
          <button
            onClick={() => navigate("/reset-password")}
            style={{
              color: "blue",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            Reset here
          </button>
        </p>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
