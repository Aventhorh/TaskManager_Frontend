import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";
import { fetchAuthAll } from "../redux/slices/auth";
import Post from "../components/Post/Post";
import TextGenerator from "../components/TextGenerator/TextGenerator";

const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const authData = useSelector((state) => state.auth.data);

  // console.log("posts", posts);
  // console.log("authData", authData);

  const userPosts = posts.items.filter((post) => {
    return post?.user?._id === authData?.user?._id;
  });

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchAuthAll());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = userPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {!authData?.success && <TextGenerator />}
      {authData?.success && (
        <div className="p-10 flex flex-col gap-10">
          <input
            className="p-3 border border-secondary rounded-lg bg-primary"
            type="text"
            placeholder="Поиск по задачам"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-5 gap-10">
            {filteredPosts.map((post) => (
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
      )}
    </div>
  );
};

export default Home;
