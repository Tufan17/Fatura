import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { auth, db } from "../../firebase";
  import {
    collection,
    where,
    doc,
    getDocs,
    setDoc,
    query,
  } from "firebase/firestore";
  
  const nicknameAndEmail = async (email: string, nickname: string) => {
    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const nicknameQuery = query(
      collection(db, "users"),
      where("nickname", "==", nickname)
    );
  
    const emailQuerySnapshot = await getDocs(emailQuery);
    const nicknameQuerySnapshot = await getDocs(nicknameQuery);
  
    return {
      email: emailQuerySnapshot.empty,
      nickname: nicknameQuerySnapshot.empty,
    };
  };
  
  const createUser = async (email: string, password: string, name: string,taxNo:string,phone:string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRefUser = doc(db, "users", user.uid);
      await setDoc(docRefUser, {
        email: user.email,
        id: user.uid,
        name: name,
        phone: phone,
        tax_no: taxNo,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
      return {
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
      };
    }
  };
  
  
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        error: error,
      };
    }
  };
  const signout = () => {
    window.localStorage.removeItem("user");
    return signOut(auth);
  };
  export { nicknameAndEmail, createUser, login, signout };
  