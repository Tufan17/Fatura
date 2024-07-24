import ClientModel from "../model/ClientModel";

const index = async (id:string) => {
  const data = await new ClientModel().getByWhere('owner_id',id);
  return data;
};
const create = async (data: any) => {
  if (data == null) {
    throw new Error("Data cannot be null or undefined");
  }
  const clientModel = new ClientModel();
  const result = await clientModel.create(data);
  return result;
};

const update = async (id: string, data: any) => {
  const result = await new ClientModel().update(id, data);
  return result;
};
const destroy = async (id: string) => {
    const result = await new ClientModel().delete(id);
    return result;
  };

export default { index, create, update,destroy };
