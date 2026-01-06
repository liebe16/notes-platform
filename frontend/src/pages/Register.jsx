import axios from "../api/axios";

export default function Register() {
  const register = async () => {
    await axios.post("/auth/register", {
      name: "User",
      email: "test@test.com",
      password: "123456",
      university: "ABC"
    });
  };

  return <button onClick={register}>Register</button>;
}