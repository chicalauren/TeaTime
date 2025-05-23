import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../utils/mutations";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [register] = useMutation(REGISTER);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({
        variables: { username, email, password },
      });

      // ✅ Save the token and username
      localStorage.setItem("id_token", data.register.token);
      localStorage.setItem("username", data.register.user.username);

      // ✅ Redirect to dashboard or homepage
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Register error:", err);
      setErrorMessage("Failed to register. Try a different email.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Register;
