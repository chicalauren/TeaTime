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
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Translucent overlay */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <div className="card shadow w-100" style={{ maxWidth: "500px", zIndex: 1 }}>
        <div
          className="d-flex flex-column justify-content-center text-white p-4"
          style={{ backgroundColor: "#222", borderRadius: "0.5rem" }}
        >
          <h2 className="text-center mb-4">Login</h2>

          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Email or Username"
              value={loginInput}
              required
              onChange={(e) => setLoginInput(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <div className="alert alert-danger p-2 text-center mb-0">
                {errorMessage}
              </div>
            )}
            <button type="submit" className="btn btn-light w-100 mt-2">
              ✅ Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
