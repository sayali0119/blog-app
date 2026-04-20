import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`).then(({ data }) => setPost(data));
    api.get(`/comments/${id}`).then(({ data }) => setComments(data));
  }, [id]);

  const handleLike = async () => {
    const { data } = await api.put(`/posts/${id}/like`);
    setPost(prev => ({ ...prev, likes: data.likes }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/comments/${id}`, { content: commentText });
    setComments(prev => [data, ...prev]);
    setCommentText('');
  };

  const handleDeleteComment = async (cid) => {
    await api.delete(`/comments/${cid}`);
    setComments(prev => prev.filter(c => c._id !== cid));
  };

  if (!post) return <p className="text-center text-gray-400 mt-20">Loading...</p>;

  const isOwner = user && post.author?._id === user.id;
  const liked = user && post.likes?.includes(user.id);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          by <span className="font-medium text-gray-600">{post.author?.username}</span> · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map(tag => (
              <span key={tag} className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-100">
          <button onClick={handleLike} disabled={!user}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${liked ? 'bg-red-50 text-red-500' : 'text-gray-500 hover:bg-gray-100'}`}>
            &#10084; {post.likes?.length || 0} {liked ? 'Liked' : 'Like'}
          </button>
          {isOwner && (
            <>
              <Link to={`/edit/${post._id}`} className="text-sm text-indigo-600 hover:underline">Edit</Link>
              <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">Delete</button>
            </>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>

        {user && (
          <form onSubmit={handleComment} className="mb-5">
            <textarea rows={3} value={commentText} placeholder="Add a comment..."
              onChange={e => setCommentText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"/>
            <button type="submit" className="mt-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition">
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id} className="flex justify-between items-start border-t border-gray-100 pt-4">
              <div>
                <span className="text-sm font-medium text-gray-700">{c.author?.username}</span>
                <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
              </div>
              {user?.id === c.author?._id && (
                <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-400 hover:text-red-600 ml-4">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}