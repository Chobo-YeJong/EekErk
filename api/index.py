import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI, Query
from exchange.ExchangeCalculator import SinhanExchange, HanaExchange

app = FastAPI()

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