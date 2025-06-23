# setup_and_save.py
import os
from create_db import create_database
from save_to_db import save_exchange_data_to_db

def main():
    print("🚀 환율 시스템 초기 설정 시작!")

    # 1. DB 테이블 생성
    print("\n1️⃣ 데이터베이스 테이블 생성...")
    create_database()

    # 2. 환율 데이터 크롤링 및 저장
    print("\n2️⃣ 환율 데이터 크롤링 및 저장...")
    save_exchange_data_to_db()

    # 3. DB 파일 확인
    if os.path.exists('exchange_rates.db'):
        print(f"\n✅ DB 파일 생성 확인: exchange_rates.db (크기: {os.path.getsize('exchange_rates.db')} bytes)")

    print("\n🎉 초기 설정 완료! 이제 FastAPI 서버를 실행해서 API를 테스트할 수 있습니다.")
    print("👉 실행 명령: uvicorn main:app --reload")

if __name__ == "__main__":
    main()