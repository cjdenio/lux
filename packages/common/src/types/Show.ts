import Fixture from "./Fixture";

export default interface Show {
  name?: string;
  path: string;

  fixtures: { [id: string]: Fixture };

  grandMaster?: number;
}
