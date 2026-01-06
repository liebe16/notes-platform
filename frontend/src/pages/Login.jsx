import api from "../api/axios";

export default function Login() {
  const login = async () => {
    const res = await api.post("/auth/login", {
      email: "test@test.com",
      password: "123456"
    });

    localStorage.setItem("token", res.data.token);
    alert("Logged in");
  };

  return <button onClick={login}>Login</button>;
}