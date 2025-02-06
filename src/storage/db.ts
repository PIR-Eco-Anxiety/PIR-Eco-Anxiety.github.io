import Dexie, { EntityTable } from "dexie";
import { ActionCompletion } from "./definitions";
import { game } from "../game/definitions";

export const db = new Dexie("game") as Dexie & {
    actionCompletion: EntityTable<ActionCompletion, "actionId">;
};

db.version(1).stores({
    actionCompletion: "actionId, completed",
});

export async function resetDb() {
    await db.actionCompletion.clear();
    await db.actionCompletion.bulkAdd(game.actions.map(action => ({ actionId: action.id, completed: false })));
}
