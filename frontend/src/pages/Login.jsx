import axios from "../api/axios";

export default function Login() {
  const login = async () => {
    await axios.post("/auth/login", {
      email: "test@test.com",
      password: "123456"
    });
  };

  return <button onClick={login}>Login</button>;
}