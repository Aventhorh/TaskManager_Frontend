import React from "react";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert(err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.log(err);
      alert("Ошибка при создании статьи");
    }
  };

  React.useEffect(() => {
    if (id && isEditing) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
      });
    }
  }, [id, isEditing]);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="rounded-lg shadow-lg p-8 w-96  border-x-2 border-secondary">
        <div className="text-2xl font-bold mb-6">
          {isEditing ? "Редактирование" : "Добавление"} задачи
        </div>
        <div className="relative">
          <button
            onClick={() => inputFileRef.current.click()}
            className="bg-secondary bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-md"
          >
            Загрузить превью
          </button>
          <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
          />
          {imageUrl && (
            <div className="mt-2 relative">
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md absolute top-0 right-0 mt-2 mr-2"
                onClick={onClickRemoveImage}
              >
                X
              </button>
              <img
                className="mt-2 rounded-lg"
                src={`http://localhost:4444${imageUrl}`}
                alt="Uploaded"
              />
            </div>
          )}
        </div>
        <input
          className="p-3 border border-secondary rounded-lg bg-primary mt-4 w-full"
          placeholder="Заголовок задачи..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="p-3 border border-secondary rounded-lg bg-primary mt-4 h-40 w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст"
        />
        <div className="flex justify-between mt-4">
          <button
            className="bg-secondary bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-md"
            onClick={onSubmit}
            disabled={!title.trim() || !text.trim()}
          >
            {isEditing ? "Сохранить" : "Опубликовать"}
          </button>
          <a href="/" className="ml-4">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">
              Отмена
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
