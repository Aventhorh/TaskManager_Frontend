import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";
import { fetchAuthAll } from "../redux/slices/auth";
import Post from "../components/Post/Post";
import TextGenerator from "../components/TextGenerator/TextGenerator";

const TaskFilters = ({
  filter,
  startDate,
  endDate,
  searchTerm,
  onFilterChange,
  onStartDateChange,
  onEndDateChange,
  onSearchTermChange,
  onResetFilters,
}) => {
  const handleFilterChange = (event) => {
    onFilterChange(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <div className="bg-primary p-4 rounded-lg border border-secondary w-full">
      <h2 className="text-white text-lg font-semibold mb-2">Фильтры</h2>
      <div className="mb-4">
        <input
          className="p-2 border border-secondary rounded-lg bg-primary"
          type="text"
          placeholder="Поиск по задачам"
          onChange={handleSearchTermChange}
        />
      </div>
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="statusFilter"
            value="all"
            checked={filter === "all"}
            onChange={handleFilterChange}
          />
          Все
        </label>
        <label className="mr-4">
          <input
            type="radio"
            name="statusFilter"
            value="open"
            checked={filter === "open"}
            onChange={handleFilterChange}
          />
          Не начато
        </label>
        <label className="mr-4">
          <input
            type="radio"
            name="statusFilter"
            value="inProgress"
            checked={filter === "inProgress"}
            onChange={handleFilterChange}
          />
          В процессе
        </label>
        <label>
          <input
            type="radio"
            name="statusFilter"
            value="done"
            checked={filter === "done"}
            onChange={handleFilterChange}
          />
          Выполнено
        </label>
      </div>
      <div className="mb-4">
        <input
          className="p-2 border border-secondary rounded-lg bg-primary"
          type="date"
          placeholder="Начальная дата"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
        <input
          className="p-2 border border-secondary rounded-lg bg-primary"
          type="date"
          placeholder="Конечная дата"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
      <button
        className="bg-secondary text-white py-2 px-4 rounded-lg"
        onClick={onResetFilters}
      >
        Сбросить
      </button>
    </div>
  );
};

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

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
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
    <div className="">
      {!authData?.success && <TextGenerator />}
      {authData?.success && (
        <div className="p-10 flex gap-10 ml-auto w-full">
          <div className="grid grid-cols-5 gap-10 w-full rounded-2xl p-10 border-x-4 border-darkGray">
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
                dueDate={post.dueDate}
              />
            ))}
          </div>
          <div className="">
            <TaskFilters
              filter={filter}
              startDate={startDate}
              endDate={endDate}
              searchTerm={searchTerm}
              onFilterChange={setFilter}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSearchTermChange={handleSearchTermChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
