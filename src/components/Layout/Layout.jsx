import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth, logout } from "../../redux/slices/auth";
import MiniProfile from "../MiniProfile/MiniProfile";

const Layout = ({ children }) => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);

  const [navbarOpen, setNavbarOpen] = useState(false);

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.setItem("token", "");
    }
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const headerHeight = "72px"; // Высота вашего заголовка

  const navbarStyle = {
    marginTop: headerHeight, // Устанавливаем marginTop для навбара
  };
  const plusButtonStyle = {
    position: "absolute",
    top: `calc(50% - 1rem)`, // Позиция по вертикали
    left: navbarOpen ? "240px" : "1rem",
    zIndex: 1000, // Устанавливаем z-индекс для кнопки
    borderRadius: "50%", // Делаем кнопку круглой
  };

  return (
    <div className="bg-primary min-h-[100vh] w-[100vw] text-white relative">
      {navbarOpen && (
        <div
          className="fixed top-0 left-0 w-64 h-full bg-primary transform transition-transform ease-in-out duration-300 z-10"
          style={navbarStyle}
        >
          <div className="p-6">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/tasks"
                  className="hover:text-secondary transition duration-300"
                >
                  Задачи
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-secondary transition duration-300"
                >
                  Профиль
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className="hover:text-secondary transition duration-300"
                >
                  Календарь
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
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
      <button
        className={`text-2xl text-white bg-primary hover:bg-secondary transition duration-300 p-4 rounded-full transform ${
          plusButtonStyle.left === "1rem" ? "" : "translate-y-1/2"
        }`}
        style={plusButtonStyle}
        onClick={toggleNavbar}
      >
        {navbarOpen ? "-" : "+"}
      </button>
      <main className={`px-6 py-12 ml-64`}>{children}</main>
    </div>
  );
};

export default Layout;
