import { IState } from "@/services/locationServices";

export const getStateAndLga = ({
  stateId,
  lgaId,
  stateList,
}: {
  stateId: string | null;
  lgaId: string | null;
  stateList: IState[];
}) => {
  const foundState = stateList.find((item) => item.id.toString() === stateId);

  const foundLga = foundState?.lgas.find((lga) => lga.id.toString() === lgaId);
  return `${foundState?.name || ""}  ${foundLga?.name || ""}`;
};
