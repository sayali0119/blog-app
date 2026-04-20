import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
      <Link to={`/posts/${post._id}`}>
        <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">{post.title}</h2>
      </Link>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>by <span className="font-medium text-gray-600">{post.author?.username}</span></span>
        <div className="flex gap-3">
          <span>?? {post.likes?.length || 0}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
