import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "testewf@twwdest.ru",
      password: "123456",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if (!data.payload) {
      return alert("Не удалось авторизоваться");
    }
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    } else {
      alert("Не удалось авторизоваться");
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="rounded-lg shadow-lg p-8 w-96">
        <div className="text-2xl font-bold mb-6">Вход в аккаунт</div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="p-3 border border-secondary rounded-lg bg-primary"
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            {...register("email", { required: "Укажите почту" })}
            type="email"
            placeholder="E-Mail"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <input
            className="p-3 border border-secondary rounded-lg bg-primary"
            label="Пароль"
            error={Boolean(errors.password?.message)}
            {...register("password", { required: "Укажите пароль" })}
            type="password"
            placeholder="Пароль"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <button
            className="bg-secondary bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 rounded-md"
            disabled={!isValid}
            type="submit"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
