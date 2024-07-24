import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import userController from "../../database/db/controller/userController";
import { useDispatch, useSelector } from "react-redux";
import { userStore } from "../redux/features/user";

const useAuthentication = () => {
  const [login, setLogin] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  useSelector((state: any) => state.user.value);
  useEffect(() => {
    const handleAuthStateChange = async (user: any) => {
      if (user) {
        await userController.getUser(user.uid!).then((res) => {
          if (res) {
            const data={
              email: res.email,
              id: res.id,
              name: res.name,
              phone: res.phone,
              tax_no: res.tax_no,
              address: res.address
            };
            dispatch(userStore(data));
          }
          if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register"
          ) {
            window.location.href = "/dashboard";
          }
          setLogin(true);
        });
      } else {
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/"
        ) {
          window.location.pathname = "/";
        }
        setLogin(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return login;
};

export default useAuthentication;
