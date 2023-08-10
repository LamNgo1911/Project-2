import axios from "axios";

const token =  JSON.parse(sessionStorage.getItem("token"))

export default axios.create({
  baseURL: "https://wearmeout.onrender.com/api/v1",
})