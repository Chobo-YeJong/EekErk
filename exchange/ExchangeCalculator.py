from .crawl import crawler

class ExchangeCalculator(crawler):
    def __init__(self):
        super().__init__()
        self.result_amount = None


class SinhanExchange(ExchangeCalculator): # 신한은행이 일반 수수료랑 다르게 계산함
    def __init__(self):
        super().__init__()

    def sinhan_USD_KRW(self, amount: float):
        self.sinhanbank() # 신한은행 크롤링시작
        USD_DEAL_BASC_RT = self.USD_DEAL_BASC_RT
        USD_TT_BUY_RT = self.USD_TT_BUY_RT
        discount_rate = float(50)  # 우대율 50%로 설정 (신한공식)
        spread = USD_DEAL_BASC_RT - USD_TT_BUY_RT # 스프레드/수수료(매매기준율-전신환매입률)
        # 적용 환율 = 전신환 매입율 + (총 스프레드 × (우대율 / 100))
        applied_rate = USD_TT_BUY_RT + (spread * (discount_rate/ 100))
        self.result_amount = round(amount * applied_rate, 2)  # 환전 원화 금액)
        return{
            "은행": "신한은행",
            "종류": "USD->KRW",
            "고시시각:": self.PBLD_TM,
            "고시회차:": self.PBLD_SQN,
            "환전 원화 금액": self.result_amount
        }
    
    def sinhan_JPY_KRW(self, amount: int):
        self.sinhanbank() # 신한은행 크롤링시작
        JPY_DEAL_BASC_RT = self.JPY_DEAL_BASC_RT
        JPY_TT_BUY_RT = self.JPY_TT_BUY_RT
        discount_rate = float(50)  # 우대율 50%로 설정 (신한공식)
        spread = JPY_DEAL_BASC_RT - JPY_TT_BUY_RT # 스프레드수수료(매매기준율-전신환매입률)
        # 적용 환율 = 전신환 매입율 + (총 스프레드 × (우대율 / 100))
        applied_rate = JPY_TT_BUY_RT + (spread * (discount_rate/ 100))
        self.result_amount = round(amount * applied_rate / 100, 2)  # 환전 원화 금액)
        return{
            "은행": "신한은행",
            "종류": "JPY->KRW",
            "고시시각:": self.PBLD_TM,
            "고시회차:": self.PBLD_SQN,
            "환전 원화 금액": self.result_amount
        }

class HanaExchange(ExchangeCalculator):
    def __init__(self):
        super().__init__()

    def hana_USD_KRW(self, amount: float):
        self.hanabank() # 하나은행 크롤링시작
        USD_TT_BUY_RT = self.USD_TT_BUY_RT
        fee_rate = float(1) # 수수료 1%로 설정
        self.result_amount = int(amount * USD_TT_BUY_RT) - int(amount * USD_TT_BUY_RT * (fee_rate / 100))
        return{
            "은행": "하나은행",
            "종류": "USD->KRW",
            "고시시각:": self.PBLD_TM,
            "고시회차:": self.PBLD_SQN,
            "환전 원화 금액": int(self.result_amount)
        }
    
    def hana_JPY_KRW(self, amount: float):
        self.hanabank() # 하나은행 크롤링시작
        JPY_TT_BUY_RT = self.JPY_TT_BUY_RT
        fee_rate = float(1) # 수수료 1%로 설정
        self.result_amount = int(amount/100 * JPY_TT_BUY_RT) - int(amount/100 * JPY_TT_BUY_RT * (fee_rate / 100))
        return{
            "은행": "하나은행",
            "종류": "JPY->KRW",
            "고시시각:": self.PBLD_TM,
            "고시회차:": self.PBLD_SQN,
            "환전 원화 금액": int(self.result_amount)
        }

# 테스트코드 주석처리 해제하고 사용 / crawl.py 테스트코드 주석처리하고 사용
    
# if __name__ == "__main__":
#     s = HanaExchange()
#     s.hana_JPY_KRW()