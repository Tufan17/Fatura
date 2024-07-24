import BillsModel from "../model/BillsModel";

const index = async (id:string) => {
  const data = await new BillsModel().getByWhere('owner_id',id);
  return data;
};
const create = async (data: any) => {
  if (data == null) {
    throw new Error("Data cannot be null or undefined");
  }
  const billsModel = new BillsModel();
  const result = await billsModel.create(data);
  return result;
};

const update = async (id: string, data: any) => {
  const result = await new BillsModel().update(id, data);
  return result;
};
const destroy = async (id: string) => {
    const result = await new BillsModel().delete(id);
    return result;
  };

export default { index, create, update,destroy };
