import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../utils/mutations"; // Your GraphQL mutation
import { useNavigate } from "react-router-dom"; // if you want to redirect after login

function Login() {
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email, password },
      });

      // ✅ Save the token and username
      localStorage.setItem("id_token", data.login.token);
      localStorage.setItem("username", data.login.user.username);

      // ✅ Redirect to dashboard or homepage
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
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
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
