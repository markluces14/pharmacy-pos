import React, { useState } from "react";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";
const LIGHT_BG = "#F0F2F2";

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
        setResponseMessage("✅ Feedback submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err: any) {
      setIsSuccess(false);
      setResponseMessage(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setResponseMessage(null), 4000);
    }
  };

  return (
    <div
      className="w-full flex justify-center mt-10"
      style={{ backgroundColor: LIGHT_BG }}
    >
      <div className="rounded-xl shadow-lg p-8 w-[32rem] bg-white">
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: PRIMARY }}
        >
          Share Your Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-left text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24B0BA]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-left text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24B0BA]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-left text-gray-700">
              Message:
            </label>
            <textarea
              name="message"
              rows={3} // reduced height
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#24B0BA]"
              placeholder="Your message..."
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 rounded-md font-semibold text-white shadow-md transition"
              style={{
                backgroundColor: PRIMARY,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {responseMessage && (
            <div
              className={`text-sm text-center mt-3 px-3 py-2 rounded-md ${
                isSuccess
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {responseMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
