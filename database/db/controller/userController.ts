import UserModel from "../model/UserModel";

const index = async () => {
  const data = await new UserModel().getAll();
return data;
};
const getUser= async (id:string) => {
  const data = await new UserModel().getById(id);
return data;
}
const update = async (id:string, data:any) => {
  const result = await new UserModel().update(id,data);
  return result;
}







export default  {index,getUser,update};