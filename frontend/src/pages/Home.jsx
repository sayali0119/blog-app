import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/posts").then(({ data }) => { setPosts(data); setLoading(false); });
  }, []);

  if (loading) return <p className="text-center text-gray-400 mt-20">Loading posts...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Latest Posts</h1>
      {posts.length === 0
        ? <p className="text-gray-400 text-center mt-20">No posts yet. Be the first to write one!</p>
        : <div className="space-y-4">{posts.map(p => <PostCard key={p._id} post={p} />)}</div>
      }
    </div>
  );
}
