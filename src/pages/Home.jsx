import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";
import { fetchAuthAll } from "../redux/slices/auth";
import Post from "../components/Post/Post";
import TextGenerator from "../components/TextGenerator/TextGenerator";
import { format } from "date-fns";

const TaskTableRow = ({
  title,
  status,
  completedDate,
  createdAt,
  updatedAt,
  dueDate,
  text,
}) => {
  const formattedCompletedDate =
    completedDate && format(new Date(completedDate), "dd.MM.yyyy / HH:mm:ss");

  const formattedDueDate =
    dueDate && format(new Date(dueDate), "dd.MM.yyyy / HH:mm:ss");

  const formattedCreatedAt = format(
    new Date(createdAt),
    "dd.MM.yyyy / HH:mm:ss"
  );
  const formattedUpdatedAt = format(
    new Date(updatedAt),
    "dd.MM.yyyy / HH:mm:ss"
  );

  const startDate = new Date(createdAt).getTime();
  const endDate = new Date(dueDate).getTime();
  const currentDate = new Date().getTime();
  const timeRemaining = Math.max(0, endDate - currentDate);
  const totalTime = endDate - startDate;
  const progressBarWidth = `${
    ((totalTime - timeRemaining) / totalTime) * 100
  }%`;

  const progressPercentage =
    totalTime === 0 ? 0 : ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <tr>
      <td className="border border-darkGray p-3">{title}</td>
      <td className="border border-darkGray p-3">{status}</td>
      <td className="border border-darkGray p-3">{formattedCompletedDate}</td>
      <td className="border border-darkGray p-3">{formattedCreatedAt}</td>
      <td className="border border-darkGray p-3">{formattedUpdatedAt}</td>
      <td className="border border-darkGray p-3">{formattedDueDate}</td>
      <td className="border border-darkGray p-3">{text}</td>
      <td className="border border-darkGray p-3">
        <div className="flex items-center">
          <div className="w-full bg-lightGray h-6 rounded-full">
            <div
              className="bg-secondary h-6 rounded-full"
              style={{ width: progressBarWidth }}
            >
              <span className="text-primary pl-1">
                {`${Math.round(progressPercentage)}%`}
              </span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

const TaskFilters = ({
  filter,
  startDate,
  endDate,
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
    <div className="bg-primary rounded-2xl w-full h-full flex flex-col gap-5 border-x-4 hover:border-secondary transition duration-300 border-darkGray p-10">
      <h2 className="text-white text-lg font-semibold mb-2">Фильтры</h2>
      <div className="">
        <input
          className="p-2 border border-secondary rounded-lg bg-primary"
          type="text"
          placeholder="Поиск по задачам"
          onChange={handleSearchTermChange}
        />
      </div>
      <div className=" flex flex-col gap-5">
        <label className="">
          <input
            type="radio"
            name="statusFilter"
            value="all"
            checked={filter === "all"}
            onChange={handleFilterChange}
          />
          Все
        </label>
        <label className="">
          <input
            type="radio"
            name="statusFilter"
            value="open"
            checked={filter === "open"}
            onChange={handleFilterChange}
          />
          Не начато
        </label>
        <label className="">
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
      <div className="flex flex-col gap-5">
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
  const [tableView, setTableView] = useState(false);

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const toggleView = () => {
    setTableView(!tableView);
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
        <div className="flex flex-col gap-10 p-10">
          <div className="flex justify-between border-x-4 rounded-2xl p-10 border-darkGray w-1/6 hover:border-secondary transition duration-300">
            <button
              className={`px-4 py-2 rounded-lg ${
                tableView ? "bg-secondary" : "bg-primary"
              } text-white font-semibold`}
              onClick={toggleView}
            >
              Сетка
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                tableView ? "bg-primary" : "bg-secondary"
              } text-white font-semibold`}
              onClick={toggleView}
            >
              Таблица
            </button>
          </div>
          <div className="flex gap-10 ml-auto w-full">
            {tableView && (
              <div className="grid grid-cols-5 gap-10 w-full rounded-2xl p-10 border-x-4 border-darkGray hover:border-secondary transition duration-300">
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
                      post.imageUrl
                        ? `http://localhost:4444${post.imageUrl}`
                        : ""
                    }
                    user={post.user}
                    userId={post.user._id}
                    dueDate={post.dueDate}
                  />
                ))}
              </div>
            )}

            {!tableView && (
              <div className="w-full border-x-4 rounded-2xl border-darkGray p-10 hover:border-secondary transition duration-300">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border border-darkGray p-3">Название</th>
                      <th className="border border-darkGray p-3">Статус</th>
                      <th className="border border-darkGray p-3">
                        Дата завершения
                      </th>
                      <th className="border border-darkGray p-3">
                        Дата создания
                      </th>
                      <th className="border border-darkGray p-3">
                        Дата обновления
                      </th>
                      <th className="border border-darkGray p-3">Срок</th>
                      <th className="border border-darkGray p-3">Примечание</th>
                      <th className="border border-darkGray p-3">Шкала</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <TaskTableRow
                        key={post._id}
                        title={post.title}
                        status={post.status}
                        completedDate={post.completedDate}
                        createdAt={post.createdAt}
                        updatedAt={post.updatedAt}
                        dueDate={post.dueDate}
                        text={post.text}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div>
              <TaskFilters
                filter={filter}
                startDate={startDate}
                endDate={endDate}
                onFilterChange={setFilter}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onSearchTermChange={handleSearchTermChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
