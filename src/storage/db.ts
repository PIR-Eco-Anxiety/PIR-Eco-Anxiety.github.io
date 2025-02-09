import Dexie, { EntityTable } from "dexie";
import { ActionCompletion, EventOccurrence, PlayerLocation } from "./definitions";
import { game } from "../game/definitions";

export const db = new Dexie("game") as Dexie & {
    actionCompletion: EntityTable<ActionCompletion, "actionId">;
    playerLocation: EntityTable<PlayerLocation, "roleId">;
    eventOccurrence: EntityTable<EventOccurrence, "eventId">;
};

db.version(1).stores({
    actionCompletion: "actionId, completed",
    playerLocation: "roleId, locationId",
    eventOccurrence: "eventId, occurred"
});

export async function resetDb() {
    await db.actionCompletion.clear();
    await db.playerLocation.clear();
    await db.eventOccurrence.clear();
    await db.actionCompletion.bulkAdd(game.actions.map(action => ({ actionId: action.id, completed: false })));
    await db.eventOccurrence.bulkAdd(game.events.map(event => ({ eventId: event.id, occurred: false })));
}
