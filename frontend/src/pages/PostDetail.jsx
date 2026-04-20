import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    api.get(`/posts/${id}`).then(({ data }) => setPost(data));
    api.get(`/comments/${id}`).then(({ data }) => setComments(data));
  }, [id]);

  const handleLike = async () => {
    const { data } = await api.put(`/posts/${id}/like`);
    setPost(prev => ({ ...prev, likes: data.likes }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/comments/${id}`, { content: commentText });
    setComments(prev => [data, ...prev]);
    setCommentText("");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/posts/${id}`);
    navigate("/");
  };

  if (!post) return <p className="text-center text-gray-400 mt-20">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>by <span className="font-medium text-gray-600">{post.author?.username}</span></span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {post.tags?.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
          <button onClick={handleLike} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition">
            ?? {post.likes?.length || 0}
          </button>
          {user?.id === post.author?._id && (
            <div className="flex gap-3 ml-auto">
              <Link to={`/edit/${id}`} className="text-sm text-indigo-600 hover:underline">Edit</Link>
              <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
        {user && (
          <form onSubmit={handleComment} className="mb-4">
            <textarea rows={3} required value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"/>
            <button type="submit" className="mt-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition">
              Post Comment
            </button>
          </form>
        )}
        {comments.length === 0
          ? <p className="text-gray-400 text-sm">No comments yet.</p>
          : comments.map(c => (
            <div key={c._id} className="border-t border-gray-100 pt-3 mt-3">
              <span className="text-sm font-medium text-gray-700">{c.author?.username}</span>
              <p className="text-sm text-gray-600 mt-1">{c.content}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
