import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('stockmate.db');


// CREATE TABLE
export function setupDatabase() {

  db.execSync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL
    );
  `);

  console.log("Database Ready");
}


// READ ITEMS
export function getItems() {

  return db.getAllSync(`
    SELECT * FROM items
    ORDER BY category ASC, id DESC
  `);

}


// CREATE ITEM
export function addItem(
  itemName,
  quantity,
  price,
  category
){

  db.runSync(
    `
    INSERT INTO items
    (
      itemName,
      quantity,
      price,
      category
    )

    VALUES (?, ?, ?, ?)
    `,
    [
      itemName,
      Number(quantity),
      Number(price),
      category
    ]
  );

}


// DELETE ITEM
export function deleteItem(id){

  db.runSync(
    `
    DELETE FROM items
    WHERE id = ?
    `,
    [id]
  );

}