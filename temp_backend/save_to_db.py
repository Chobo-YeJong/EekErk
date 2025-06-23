
# save_to_db.py
import sqlite3
import sys
import os
from datetime import datetime

# 상위 디렉토리를 Python 경로에 추가 (exchange 폴더 접근용)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from exchange.crawl import crawler

def save_exchange_data_to_db():
    """크롤링 후 DB에 저장"""
    print("📊 환율 데이터 크롤링 및 저장 시작...")

    # 크롤러 초기화
    c = crawler()

    try:
        conn = sqlite3.connect('exchange_rates.db')
        cursor = conn.cursor()

        # 신한은행 크롤링
        print("🏦 신한은행 크롤링 중...")
        c.sinhanbank()

        # 기존 신한은행 데이터 삭제 (최신 데이터만 유지)
        cursor.execute("DELETE FROM exchange_rates WHERE bank_name = '신한은행'")

        # 신한은행 USD 데이터 저장
        cursor.execute('''
                       INSERT INTO exchange_rates
                       (bank_name, currency, base_rate, buy_rate, updated_time, announcement_round)
                       VALUES (?, ?, ?, ?, ?, ?)
                       ''', (
                           '신한은행',
                           'USD',
                           c.USD_DEAL_BASC_RT,
                           c.USD_TT_BUY_RT,
                           ' '.join(c.PBLD_TM) if isinstance(c.PBLD_TM, list) else str(c.PBLD_TM),
                           c.PBLD_SQN
                       ))

        # 신한은행 JPY 데이터 저장
        cursor.execute('''
                       INSERT INTO exchange_rates
                       (bank_name, currency, base_rate, buy_rate, updated_time, announcement_round)
                       VALUES (?, ?, ?, ?, ?, ?)
                       ''', (
                           '신한은행',
                           'JPY',
                           c.JPY_DEAL_BASC_RT,
                           c.JPY_TT_BUY_RT,
                           ' '.join(c.PBLD_TM) if isinstance(c.PBLD_TM, list) else str(c.PBLD_TM),
                           c.PBLD_SQN
                       ))

        print("✅ 신한은행 데이터 저장 완료!")

        # 하나은행 크롤링
        print("🏦 하나은행 크롤링 중...")
        c.hanabank()

        # 기존 하나은행 데이터 삭제
        cursor.execute("DELETE FROM exchange_rates WHERE bank_name = '하나은행'")

        # 하나은행 USD 데이터 저장
        cursor.execute('''
                       INSERT INTO exchange_rates
                       (bank_name, currency, base_rate, buy_rate, updated_time, announcement_round)
                       VALUES (?, ?, ?, ?, ?, ?)
                       ''', (
                           '하나은행',
                           'USD',
                           c.USD_DEAL_BASC_RT,
                           c.USD_TT_BUY_RT,
                           c.PBLD_TM,
                           c.PBLD_SQN
                       ))

        # 하나은행 JPY 데이터 저장
        cursor.execute('''
                       INSERT INTO exchange_rates
                       (bank_name, currency, base_rate, buy_rate, updated_time, announcement_round)
                       VALUES (?, ?, ?, ?, ?, ?)
                       ''', (
                           '하나은행',
                           'JPY',
                           c.JPY_DEAL_BASC_RT,
                           c.JPY_TT_BUY_RT,
                           c.PBLD_TM,
                           c.PBLD_SQN
                       ))

        print("✅ 하나은행 데이터 저장 완료!")

        conn.commit()

        # 저장된 데이터 확인
        cursor.execute("SELECT * FROM exchange_rates ORDER BY created_at DESC")
        results = cursor.fetchall()

        print("\n📋 저장된 데이터:")
        print("ID | 은행 | 통화 | 매매기준율 | 전신환매입율 | 고시시각 | 고시회차 | 저장시간")
        print("-" * 80)
        for row in results:
            print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} | {row[6]} | {row[7]}")

        conn.close()
        print(f"\n🎉 총 {len(results)}개 데이터가 성공적으로 저장되었습니다!")

    except Exception as e:
        print(f"❌ 데이터 저장 실패: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
    finally:
        if hasattr(c, 'driver') and c.driver:
            c.driver.quit()

if __name__ == "__main__":
    save_exchange_data_to_db()