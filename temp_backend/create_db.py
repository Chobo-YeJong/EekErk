# create_db.py
import sqlite3
from datetime import datetime

def create_database():
    conn = sqlite3.connect('exchange_rates.db')
    cursor = conn.cursor()

    # 테이블 생성
    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS exchange_rates (
                                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                                 bank_name TEXT NOT NULL,
                                                                 currency TEXT NOT NULL,
                                                                 base_rate REAL NOT NULL,
                                                                 buy_rate REAL NOT NULL,
                                                                 sell_rate REAL,
                                                                 updated_time TEXT,
                                                                 announcement_round TEXT,
                                                                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                   )
                   ''')

    # 인덱스 생성 (조회 성능 향상)
    cursor.execute('''
                   CREATE INDEX IF NOT EXISTS idx_bank_currency
                       ON exchange_rates(bank_name, currency, created_at DESC)
                   ''')

    conn.commit()
    conn.close()
    print("✅ 데이터베이스 테이블이 생성되었습니다!")

if __name__ == "__main__":
    create_database()