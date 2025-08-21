import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('./data/data.db')
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS route_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route_id INTEGER,
            seq INTEGER,
            lat REAL,
            lon REAL,
            dist_nm REAL,
            FOREIGN KEY (route_id) REFERENCES routes (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vessels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            base_speed_kn REAL,
            lightship_t REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forecasts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            segment_id INTEGER,
            dt_iso TEXT,
            wind_speed_ms REAL,
            wind_deg REAL,
            hs_m REAL,
            tp_s REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed data
    cursor.execute("INSERT INTO routes (name) VALUES ('Sample Route')")
    route_id = cursor.lastrowid

    cursor.execute("INSERT INTO route_points (route_id, seq, lat, lon, dist_nm) VALUES (?, 1, 12.9, 74.8, 50)", (route_id,))
    cursor.execute("INSERT INTO route_points (route_id, seq, lat, lon, dist_nm) VALUES (?, 2, 13.0, 75.0, 50)", (route_id,))

    cursor.execute("INSERT INTO vessels (name, base_speed_kn) VALUES ('Demo Vessel', 12.0)")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()