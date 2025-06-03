import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_SECURITY_QUESTION } from "../utils/queries";
import { RESET_PASSWORD_WITH_SECURITY } from "../utils/mutations"; // You need to create this!

function ResetWithSecurity() {
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const [getQuestion, { error }] = useLazyQuery(GET_SECURITY_QUESTION);
  const [resetPassword, { loading: resetting }] = useMutation(
    RESET_PASSWORD_WITH_SECURITY
  );

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await getQuestion({ variables: { email } });
      const securityQ = result.data?.getSecurityQuestion;
      if (securityQ) {
        setQuestion(securityQ);
        setStep(2);
      } else {
        setMessage("No security question found for that email.");
      }
    } catch {
      setMessage("Error fetching security question.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({
        variables: { email, securityAnswer, newPassword },
      });
      setMessage("Password reset successfully. You can now log in.");
      setStep(3);
    } catch {
      setMessage("Security answer incorrect or reset failed.");
    }
  };

  return (
    <div>
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <h2>Find Your Security Question</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Get Question</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleReset}>
          <h2>Answer Security Question</h2>
          <p>
            <strong>{question}</strong>
          </p>
          <input
            type="text"
            placeholder="Your Answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={resetting}>
            Reset Password
          </button>
        </form>
      )}
      {message && <p>{message}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default ResetWithSecurity;
