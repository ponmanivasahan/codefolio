import axios from "axios";

async function test() {
  try {
    const res = await axios.post("http://localhost:4000/api/auth/register", {
      name: "PONMANIVASAHAN T",
      email: "vasupks0111@gmail.com",
      username: "pmanivas",
      password: "password123"
    });
    console.log(res.data);
  } catch (err) {
    console.error("Error Response:", err.response?.data || err.message);
  }
}
test();