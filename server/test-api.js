import axios from "axios";
async function test() {
  try {
    const res = await axios.get("http://localhost:4000/api/portfolio/demo1");
    console.log("Success:", res.data.success);
  } catch (err) {
    console.error("Error Response:", err.response?.data || err.message);
  }
}
test();