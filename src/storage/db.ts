import {SQLJsDatabase, drizzle} from "drizzle-orm/sql-js";
import initSqlJS, { Database } from "sql.js";

let SQL: initSqlJS.SqlJsStatic;
let rawDb: Database;
export let db: SQLJsDatabase;

export async function initSQL(): Promise<void> {
  SQL = await initSqlJS({locateFile: (file) => `https://sql.js.org/dist/${file}`});
}

export function createDatabase() {
  rawDb = new SQL.Database();
  db = drizzle(rawDb);
}

export function loadDatabase(callback: (success: boolean) => void) {
  const idb = window.indexedDB.open("drizzle", 1);
  idb.onsuccess = (_event) => {
    const adb = idb.result;
    const tx = adb.transaction("db", "readwrite");
    const store = tx.objectStore("db");
    const request = store.get("db");
    request.onsuccess = (_event) => {
      const buffer = request.result;
      if (buffer) {
        rawDb = new SQL.Database(buffer);
        db = drizzle(rawDb);
        callback(true);
      } else {
        callback(false);
      }
    }
  }
  idb.onerror = (_event) => {
    callback(false);
  }
}

export function exportDatabase(callback: (success: boolean) => void) {
  if (rawDb) {
    const buffer = rawDb.export();
    // Store in IndexedDB
    const idb = window.indexedDB.open("drizzle", 1);
    idb.onsuccess = (_event) => {
      const db = idb.result;
      const tx = db.transaction("db", "readwrite");
      const store = tx.objectStore("db");
      store.put(buffer, "db");
      tx.oncomplete = (_event) => {
        callback(true);
      }
      tx.onerror = (_event) => {
        callback(false);
      }
    }
    idb.onerror = (_event) => {
      callback(false);
    }
  }
}
