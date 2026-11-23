PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS clients (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    phone TEXT NOT NULL,
    UNIQUE (name, phone)
);

CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id     INTEGER NOT NULL,
    flavor        TEXT NOT NULL,
    cover         TEXT NOT NULL,
    toppings      TEXT NOT NULL,
    shape         TEXT NOT NULL,
    size          TEXT NOT NULL,
    floors        INTEGER NOT NULL CHECK (floors BETWEEN 1 AND 3),
    delivery_date TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'PENDING'
                  CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);