import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth, logout } from "../../redux/slices/auth";
import MiniProfile from "../MiniProfile/MiniProfile";

const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.setItem("token", "");
    }
  };

  return (
    <nav className="text-white p-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-semibold hover:text-secondary">
          Progressive Task Manager
        </Link>
      </div>
      <MiniProfile item={data} />
      <div className="flex items-center gap-6">
        {isAuth ? (
          <>
            <Link
              to="/add-post"
              className="hover:text-secondary transition duration-300"
            >
              Добавить задачу
            </Link>
            <button
              className="hover:text-secondary transition duration-300"
              onClick={onClickLogout}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-secondary transition duration-300"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="hover:text-secondary transition duration-300"
            >
              Создать аккаунт
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
