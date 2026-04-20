import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NewPost() {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      const { data } = await api.post("/posts", payload);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Post</h1>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input type="text" required value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Content</label>
          <textarea required rows={10} value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"/>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input type="text" value={form.tags}
            onChange={e => setForm({...form, tags: e.target.value})}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          Publish Post
        </button>
      </form>
    </div>
  );
}
