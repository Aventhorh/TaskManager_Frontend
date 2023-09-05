import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import React from "react";
import { fetchAuthMe } from "./redux/slices/auth";
import Home from "./pages/Home";
import FullPost from "./pages/FullPost";
import AddPost from "./pages/AddPost/AddPost";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Layout from "./components/Layout/Layout";

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <section className="bg-primary min-h-[100vh] w-[100vw] !text-whites">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Layout>
    </section>
  );
};

export default App;
