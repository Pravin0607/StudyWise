// create axios instance which takes token from zustand store
import axios from "axios";
import useUserStore from "@/store/userStore";
import { base_url } from "./constants";

const axiosInstance = axios.create({
  baseURL: base_url,
});