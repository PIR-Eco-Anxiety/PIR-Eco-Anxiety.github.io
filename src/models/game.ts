import { Action } from "./action";
import { Map } from "./map";
import { Role } from "./role";
import { Event } from "./event";

export interface Game {
  roles: Role[];
  map: Map;
  actions: Action[];
  events: Event[];
}
