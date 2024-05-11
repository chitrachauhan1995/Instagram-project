import { useState } from "react";
import Cookies from "js-cookie";
import {decodeObj, encodeObj} from "./services/common";

const useToken = () => {
  const getToken = () => {
    const token = Cookies.get("token");
    return token ? token : null;
  };

  const [token, setToken] = useState(getToken());
  const saveToken = (userToken) => {
    setTimeout(() => {
      Cookies.set("token", userToken, {
        expires: 7,
        secure: true,
      }, 500);
    setToken(userToken);
    })
  };
  return {
    setToken: saveToken,
    token,
  };
};

export default useToken;
