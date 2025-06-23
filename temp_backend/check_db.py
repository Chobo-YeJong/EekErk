# check_db.py
import sqlite3
from datetime import datetime

def check_database():
    """DB에 저장된 데이터 확인"""
    try:
        conn = sqlite3.connect('exchange_rates.db')
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM exchange_rates")
        count = cursor.fetchone()[0]

        if count == 0:
            print("❌ DB에 데이터가 없습니다. save_to_db.py를 먼저 실행해주세요!")
            return False

        print(f"✅ DB에 {count}개의 환율 데이터가 있습니다.")

        cursor.execute("""
                       SELECT bank_name, currency, base_rate, buy_rate, updated_time, announcement_round, created_at
                       FROM exchange_rates
                       ORDER BY created_at DESC
                       """)

        results = cursor.fetchall()

        print("\n📊 최신 환율 데이터:")
        print("은행 | 통화 | 매매기준율 | 전신환매입율 | 고시시각 | 고시회차 | 저장시간")
        print("-" * 90)

        for row in results:
            print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} | {row[6]}")

        conn.close()
        return True

    except Exception as e:
        print(f"❌ DB 확인 실패: {e}")
        return False

if __name__ == "__main__":
    check_database()