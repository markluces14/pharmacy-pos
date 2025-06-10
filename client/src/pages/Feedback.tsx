import React, { useState } from "react";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMessage(null);
    setIsSuccess(false);

    try {
      const res = await fetch("http://localhost:8000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setResponseMessage(
          `Success! ${data.message} We've sent a confirmation to ${formData.email}.`
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to submit feedback");
      }
    } catch (err: any) {
      setIsSuccess(false);
      setResponseMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setResponseMessage(null), 5000);
    }
  };

  return (
    <div
      className="container max-w-lg mx-auto rounded-xl shadow p-6 mt-6"
      style={{ backgroundColor: "#F0F2F2" }}
    >
      <h2 className="text-2xl font-bold mb-5" style={{ color: PRIMARY }}>
        Share Your Feedback
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Your Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: "#ccc", focusRingColor: ACCENT }}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: "#ccc" }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Your Feedback</label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: "#ccc" }}
            placeholder="Your thoughts..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-md text-white font-semibold shadow"
          style={{
            backgroundColor: PRIMARY,
            opacity: submitting ? 0.8 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Sending...
            </span>
          ) : (
            "Submit Feedback"
          )}
        </button>

        {responseMessage && (
          <div
            className={`p-3 rounded-md text-sm mt-2 ${
              isSuccess
                ? "text-green-800 bg-green-100"
                : "text-red-800 bg-red-100"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
