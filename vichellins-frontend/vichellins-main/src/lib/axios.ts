import { toast } from "@/hooks/useToast";
import Axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import routes from "./routes";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("BASE_URL", BASE_URL);

export const axiosPrivate = Axios.create({
  baseURL: BASE_URL,
});

axiosPrivate.interceptors.request.use(
  async function (config) {
    const session = await getSession();

    if (session?.token) {
      config.headers["Authorization"] = `Bearer ${session?.token}`;
    }
    return config;
  },
  (error) => errorHandler(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => errorHandler(error),
);

const errorHandler = (error: AxiosError) => {
  if (error.status === 408 && error.message.includes("timeout")) {
    toast({
      title: "Opps! Error",
      description:
        "Oops! Your request took too long, please retry your last action",
      variant: "destructive",
    });
  }

  switch (error.status) {
    case 401:
    case 403: {
      signOut({
        redirect: true,
        callbackUrl: routes.login,
      });
      toast({
        title: "Error in Login",
        description: error.response?.data as string,
        variant: "destructive",
      });
      return Promise.reject(error);
    }

    default:
      return Promise.reject(error);
  }
};
