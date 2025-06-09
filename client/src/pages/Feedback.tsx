import React, { useState } from "react";
import api from "../api/api";

const Feedback: React.FC = () => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/feedback", { message });
      setSuccess(true);
      setMessage("");
    } catch (err) {
      alert("Error sending feedback");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Feedback Form</h2>
      {success && (
        <div className="alert alert-success">Thank you for your feedback!</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Your Message</label>
          <textarea
            className="form-control"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Send Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;
