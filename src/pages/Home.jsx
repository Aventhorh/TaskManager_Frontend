import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";
import { fetchAuthAll } from "../redux/slices/auth";
import Post from "../components/Post/Post";
import TextGenerator from "../components/TextGenerator/TextGenerator";

const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchAuthAll());
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <TextGenerator />
      <div className="grid grid-cols-5 gap-10 p-10">
        {posts.items.map((post) => (
          <Post
            key={post._id}
            id={post._id}
            title={post.title}
            status={post.status}
            completedDate={post.completedDate}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
            imageUrl={
              post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ""
            }
            user={post.user}
            userId={post.user._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
