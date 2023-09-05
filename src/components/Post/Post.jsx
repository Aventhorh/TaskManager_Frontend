import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { UserInfo } from "../UserInfo/UserInfo";
import { fetchRemovePost } from "../../redux/slices/posts";
import { format } from "date-fns";

const Post = ({
  id,
  title,
  status,
  completedDate,
  createdAt,
  updatedAt,
  imageUrl,
  user,
  isFullPost,
  userId,
}) => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth.data);

  const onClickRemove = () => {
    if (window.confirm("Вы действительно хотите удалить статью?")) {
      dispatch(fetchRemovePost(id));
    }
  };

  const isUserPost = authData && authData.user && authData.user._id === userId;

  const formattedCreatedAt = format(
    new Date(createdAt),
    "dd.MM.yyyy / HH:mm:ss"
  );
  const formattedUpdatedAt = format(
    new Date(updatedAt),
    "dd.MM.yyyy / HH:mm:ss"
  );

  return (
    <div className="relative flex flex-col p-4 bg-primary rounded-lg shadow-xl hover:shadow-secondary transition duration-300 hover:scale-105  border-x-2 border-secondary">
      {isUserPost && (
        <div
          className={`${
            imageUrl ? "absolute top-0 right-0" : "w-[35%] ml-auto"
          } mb-2 border border-1 border-white rounded-lg mr-4 mt-4`}
        >
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="inherit">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton color="inherit" onClick={onClickRemove}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img className="mb-2 rounded-lg" src={imageUrl} alt={title} />
      )}
      <div className="">
        <UserInfo {...user} additionalText={formattedCreatedAt} />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold mb-2">
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <p className="text-gray-500">Status: {status}</p>
          {completedDate && (
            <p className="text-gray-500">Completed Date: {completedDate}</p>
          )}
          <p className="text-gray-500">Created At: {formattedCreatedAt}</p>
          <p className="text-gray-500">Updated At: {formattedUpdatedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
