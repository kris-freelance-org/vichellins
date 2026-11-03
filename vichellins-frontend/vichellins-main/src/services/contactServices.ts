import axios from "axios";

export interface IContactInfo {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMsg = async (info: IContactInfo) => {
  const res = await axios.post(`/contact/create`, info);

  return res.data;
};
