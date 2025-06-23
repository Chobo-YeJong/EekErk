
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware  # 이 줄 추가
from exchange.ExchangeCalculator import SinhanExchange, HanaExchange

app = FastAPI()

# CORS 설정 추가 - 이 부분만 추가하세요!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:3000"],  # Vite 개발서버 주소 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기존 API 엔드포인트들 (변경 없음)
@app.get("/sinhan/usd-krw")
def sinhan_usd_krw(amount: float = Query(..., description="환전할 달러 금액")):
    s = SinhanExchange()
    return s.sinhan_USD_KRW(amount)

@app.get("/sinhan/jpy-krw")
def sinhan_jpy_krw(amount: int = Query(..., description="환전할 엔 금액")):
    s = SinhanExchange()
    return s.sinhan_JPY_KRW(amount)

@app.get("/hana/usd-krw")
def hana_usd_krw(amount: float = Query(..., description="환전할 달러 금액")):
    h = HanaExchange()
    return h.hana_USD_KRW(amount)

@app.get("/hana/jpy-krw")
def hana_jpy_krw(amount: float = Query(..., description="환전할 엔 금액")):
    h = HanaExchange()
    return h.hana_JPY_KRW(amount)