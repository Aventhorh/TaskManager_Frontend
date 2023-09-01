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

  const userPosts = posts.items.filter((post) => {
    return post?.user?._id === authData?.user?._id;
  });

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchAuthAll());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const filteredPosts = userPosts
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((post) => {
      if (filter === "all") {
        return true;
      }
      if (filter === "open") {
        return post.status === "OPEN";
      }
      if (filter === "inProgress") {
        return post.status === "IN_PROGRESS";
      }
      if (filter === "done") {
        return post.status === "DONE";
      }
      return true;
    })
    .filter((post) => {
      if (!startDate && !endDate) {
        return true;
      }
      const postDate = new Date(post.createdAt);
      if (startDate && !endDate) {
        return postDate >= new Date(startDate);
      }
      if (!startDate && endDate) {
        return postDate <= new Date(endDate);
      }
      return postDate >= new Date(startDate) && postDate <= new Date(endDate);
    });

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
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filter === "all"}
                onChange={handleFilterChange}
              />
              Все
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="filter"
                value="open"
                checked={filter === "open"}
                onChange={handleFilterChange}
              />
              Не начато
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="filter"
                value="inProgress"
                checked={filter === "inProgress"}
                onChange={handleFilterChange}
              />
              В процессе
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="done"
                checked={filter === "done"}
                onChange={handleFilterChange}
              />
              Выполнено
            </label>
          </div>
          <div className="mb-4">
            <input
              className="p-3 border border-secondary rounded-lg bg-primary"
              type="date"
              placeholder="Начальная дата"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <input
              className="p-3 border border-secondary rounded-lg bg-primary"
              type="date"
              placeholder="Конечная дата"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <button
            className="bg-secondary text-white py-2 px-4 rounded-lg"
            onClick={handleResetFilters}
          >
            Сбросить
          </button>
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
