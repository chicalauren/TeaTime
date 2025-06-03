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

      localStorage.setItem("id_token", data.register.token);
      localStorage.setItem("username", data.register.user.username);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Register error:", err);
      setErrorMessage("Failed to register. Try a different email.");
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
      {/* Overlay */}
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
          <h2 className="text-center mb-4">Register</h2>

          <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
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
              ✅ Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
