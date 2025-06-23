# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime
from typing import Dict, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 은행별 환율 계산 설정 (확장 가능)
BANK_CONFIGS = {
    "신한은행": {
        "discount_rate": 50.0,  # 우대율 50%
        "calculation_type": "spread_discount",
        "description": "우대율 50% 적용"
    },
    "하나은행": {
        "fee_rate": 1.0,  # 수수료 1%
        "calculation_type": "fee_deduction",
        "description": "수수료 1% 적용"
    }
    # 새 은행 추가 시 여기만 수정하면 됨
    # "국민은행": {
    #     "discount_rate": 30.0,
    #     "calculation_type": "spread_discount",
    #     "description": "우대율 30% 적용"
    # }
}

# 지원 통화 목록 (확장 가능)
SUPPORTED_CURRENCIES = ["USD", "JPY"]
# SUPPORTED_CURRENCIES = ["USD", "JPY", "EUR", "CNY"]  # 나중에 확장

def get_latest_rate(bank_name: str, currency: str) -> Dict:
    """DB에서 최신 환율 데이터 조회"""
    conn = sqlite3.connect('exchange_rates.db')
    cursor = conn.cursor()

    cursor.execute("""
                   SELECT base_rate, buy_rate, updated_time, announcement_round
                   FROM exchange_rates
                   WHERE bank_name = ? AND currency = ?
                   ORDER BY created_at DESC
                       LIMIT 1
                   """, (bank_name, currency))

    result = cursor.fetchone()
    conn.close()

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"{bank_name} {currency} 환율 데이터를 찾을 수 없습니다"
        )

    return {
        'base_rate': result[0],
        'buy_rate': result[1],
        'updated_time': result[2],
        'announcement_round': result[3]
    }

def calculate_exchange_rate(bank_name: str, currency: str, amount: float) -> Dict:
    """은행별 환율 계산 (범용 함수)"""
    if bank_name not in BANK_CONFIGS:
        raise HTTPException(status_code=400, detail=f"지원되지 않는 은행: {bank_name}")

    if currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=400, detail=f"지원되지 않는 통화: {currency}")

    rate_data = get_latest_rate(bank_name, currency)
    config = BANK_CONFIGS[bank_name]

    # 신한은행식 계산 (우대율 적용)
    if config["calculation_type"] == "spread_discount":
        discount_rate = config["discount_rate"]
        spread = rate_data['base_rate'] - rate_data['buy_rate']
        applied_rate = rate_data['buy_rate'] + (spread * (discount_rate / 100))
        result_amount = round(amount * applied_rate, 2)

    # 하나은행식 계산 (수수료 차감)
    elif config["calculation_type"] == "fee_deduction":
        fee_rate = config["fee_rate"]
        buy_rate = rate_data['buy_rate']

        # JPY는 100엔 단위로 계산
        if currency == "JPY":
            amount = amount / 100

        result_amount = int(amount * buy_rate) - int(amount * buy_rate * (fee_rate / 100))

    else:
        raise HTTPException(status_code=500, detail="알 수 없는 계산 방식")

    return {
        "은행": bank_name,
        "종류": f"{currency}->KRW",
        "고시시각": rate_data['updated_time'],
        "고시회차": rate_data['announcement_round'],
        "환전 원화 금액": result_amount,
        "계산방식": config["description"]
    }

# 범용 API 엔드포인트들
@app.get("/exchange/{bank_name}/{currency}-krw")
def exchange_to_krw(bank_name: str, currency: str, amount: float):
    """범용 환전 API - 모든 은행/통화 지원"""
    return calculate_exchange_rate(bank_name, currency.upper(), amount)

# 지원 은행 목록 조회
@app.get("/banks")
def get_supported_banks():
    """지원하는 은행 목록 반환"""
    return {
        "supported_banks": list(BANK_CONFIGS.keys()),
        "bank_details": BANK_CONFIGS
    }

# 지원 통화 목록 조회
@app.get("/currencies")
def get_supported_currencies():
    """지원하는 통화 목록 반환"""
    return {
        "supported_currencies": SUPPORTED_CURRENCIES
    }

# 모든 은행의 특정 통화 환율 비교
@app.get("/compare/{currency}-krw")
def compare_all_banks(currency: str, amount: float = 1):
    """모든 은행의 환율 비교"""
    currency = currency.upper()
    results = []

    for bank_name in BANK_CONFIGS.keys():
        try:
            result = calculate_exchange_rate(bank_name, currency, amount)
            results.append(result)
        except HTTPException:
            # 해당 은행에 데이터가 없으면 스킵
            continue

    # 환율 높은 순으로 정렬 (더 많은 원화를 받는 순)
    results.sort(key=lambda x: x["환전 원화 금액"], reverse=True)

    return {
        "currency": currency,
        "amount": amount,
        "banks": results,
        "best_bank": results[0] if results else None
    }

# 기존 API들도 유지 (하위 호환성)
@app.get("/sinhan/usd-krw")
def sinhan_usd_krw(amount: float):
    return calculate_exchange_rate("신한은행", "USD", amount)

@app.get("/sinhan/jpy-krw")
def sinhan_jpy_krw(amount: float):
    return calculate_exchange_rate("신한은행", "JPY", amount)

@app.get("/hana/usd-krw")
def hana_usd_krw(amount: float):
    return calculate_exchange_rate("하나은행", "USD", amount)

@app.get("/hana/jpy-krw")
def hana_jpy_krw(amount: float):
    return calculate_exchange_rate("하나은행", "JPY", amount)