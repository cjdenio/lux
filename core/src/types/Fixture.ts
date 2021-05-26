import { PropertyMap } from "./Property";

export default interface Fixture {
  id: number;
  name: string;
  definitionId: string;
  startChannel: number;
  properties: PropertyMap;
}
