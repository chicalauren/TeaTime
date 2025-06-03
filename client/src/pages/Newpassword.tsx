import { useState } from "react";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../utils/mutations";
import { useNavigate, useParams } from "react-router-dom";

function SetNewPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ variables: { token, newPassword } });
      navigate("/login");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set New Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        Reset Password
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}

export default SetNewPassword;
