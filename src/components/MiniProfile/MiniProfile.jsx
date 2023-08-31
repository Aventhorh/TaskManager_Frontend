import React from "react";
import { useSelector } from "react-redux";

const MiniProfile = ({ item }) => {
  const { posts } = useSelector((state) => state.posts);
  const { data } = useSelector((state) => state.auth);
  const [userData, setUserData] = React.useState([]);

  React.useEffect(() => {
    const getId = () => {
      if (data !== null) {
        const end = posts.items.filter((postItem) => {
          return postItem.user._id === data.user._id;
        });
        setUserData(end);
      }
    };

    getId();
  }, [data, posts]);

  return (
    <div className="flex items-center gap-4">
      {item?.user?.fullName && (
        <>
          <h2 className="text-white font-semibold hover:text-secondary">
            {item?.user?.fullName}
          </h2>
          <h3 className="text-secondary">Создано задач: {userData.length}</h3>
        </>
      )}
    </div>
  );
};

export default MiniProfile;
