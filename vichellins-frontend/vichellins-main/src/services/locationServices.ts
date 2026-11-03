import axios from "axios";

export interface ILga {
  id: number;
  name: string;
  state_id: number;
  state: IState;
}

export interface IState {
  id: number;
  name: string;
  state_id: number;
  lgas: ILga[];
}

export const getAllStates = async () => {
  const res = await axios.get(`/states`);

  return res.data.data.states as IState[];
};

export const getStateLGA = async (state_id: string) => {
  const res = await axios.get(`/lgas/state/${state_id}`);

  return res.data.data.lgas as ILga[];
};
