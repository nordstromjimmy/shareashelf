"use client";
import { useState } from "react";

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent full page reload
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("There was a problem submitting your feedback. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Send us your feedback
      </h2>

      {!submitted ? (
        <form
          action="https://formspree.io/f/xnnveeyl"
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <textarea
            name="message"
            required
            placeholder="Your feedback..."
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded text-white"
            rows={4}
          ></textarea>
          <input
            type="email"
            name="email"
            placeholder="Your email (optional)"
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow cursor-pointer"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      ) : (
        <p className="text-center text-amber-200">Thanks for your feedback!</p>
      )}
    </div>
  );
}
