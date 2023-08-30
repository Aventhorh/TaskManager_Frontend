import React from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import Post from "../components/Post/Post";

const FullPost = () => {
  const [data, setData] = React.useState();
  const [Loading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [id]);

  if (Loading) {
    return <Post isLoading={Loading} isFullPost />;
  }

  return (
    <div className="p-10">
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
    </div>
  );
};

export default FullPost;
