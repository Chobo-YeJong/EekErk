from crawl import crawler

class ExchangeCalculator(crawler):
    def __init__(self):
        super().__init__()
        self.result_amount = None


class SinhanExchange(ExchangeCalculator):
    def __init__(self):
        super().__init__()
        # 일단 얼마를 바꿀지 입력을 받아야하니 input으로 간단하게 구현해놓고 나중에 어떻게 받을지 생각

    def sinhan_USD_KRW(self):
        print("신한은행 환율 계산기 - USD->KRW")
        self.sinhanbank() # 신한은행 크롤링시작
        amount = float(input("환전할 달러 금액만 입력하세요 (예: 12.34): "))
        print("고시시각:", self.PBLD_TM)
        print("고시회차:", self.PBLD_SQN)
        USD_DEAL_BASC_RT = self.USD_DEAL_BASC_RT
        USD_TT_BUY_RT = self.USD_TT_BUY_RT
        discount_rate = float(50)  # 우대율 50%로 설정 (신한공식)
        spread = USD_DEAL_BASC_RT - USD_TT_BUY_RT # 스프레드/수수료(매매기준율-전신환매입률)
        # 적용 환율 = 전신환 매입율 + (총 스프레드 × (우대율 / 100))
        applied_rate = USD_TT_BUY_RT + (spread * (discount_rate/ 100))
        self.result_amount = round(amount * applied_rate, 2)  # 환전 원화 금액)
        print(f"환전 원화 금액: {self.result_amount} KRW")
    
    def sinhan_JPY_KRW(self):
        print("신한은행 환율 계산기 - JPY->KRW")
        self.sinhanbank() # 신한은행 크롤링시작
        amount = int(input("환전할 엔화 금액만 입력하세요 (예: 234): "))
        print("고시시각:", self.PBLD_TM)
        print("고시회차:", self.PBLD_SQN)
        JPY_DEAL_BASC_RT = self.JPY_DEAL_BASC_RT
        JPY_TT_BUY_RT = self.JPY_TT_BUY_RT
        discount_rate = float(50)  # 우대율 50%로 설정 (신한공식)
        spread = JPY_DEAL_BASC_RT - JPY_TT_BUY_RT # 스프레드수수료(매매기준율-전신환매입률) 신한은행이 일반 수수료랑 살짝 다르게 계산함
        # 적용 환율 = 전신환 매입율 + (총 스프레드 × (우대율 / 100))
        applied_rate = JPY_TT_BUY_RT + (spread * (discount_rate/ 100))
        self.result_amount = round(amount * applied_rate / 100, 2)  # 환전 원화 금액)
        print(f"환전 원화 금액: {self.result_amount} KRW")

class HanaExchange(ExchangeCalculator):
    def __init__(self):
        super().__init__()

    def hana_USD_KRW(self):
        print("하나은행 환율 계산기 - USD->KRW")
        self.hanabank() # 하나은행 크롤링시작
        amount = float(input("환전할 달러 금액만 입력하세요 (예: 12.34): "))
        print("고시시각:", self.PBLD_TM)
        print("고시회차:", self.PBLD_SQN)
        USD_TT_BUY_RT = self.USD_TT_BUY_RT
        fee_rate = float(1) # 수수료 1%로 설정
        self.result_amount = int(amount * USD_TT_BUY_RT) - int(amount * USD_TT_BUY_RT * (fee_rate / 100))
        print(f"환전 원화 금액: {int(self.result_amount)} KRW")
    
    def hana_JPY_KRW(self):
        print("하나은행 환율 계산기 - JPY->KRW")
        self.hanabank() # 하나은행 크롤링시작
        amount = float(input("환전할 엔화 금액만 입력하세요 (예: 234): "))
        print("고시시각:", self.PBLD_TM)
        print("고시회차:", self.PBLD_SQN)
        JPY_TT_BUY_RT = self.JPY_TT_BUY_RT
        fee_rate = float(1) # 수수료 1%로 설정
        self.result_amount = int(amount/100 * JPY_TT_BUY_RT) - int(amount/100 * JPY_TT_BUY_RT * (fee_rate / 100))
        print(f"환전 원화 금액: {int(self.result_amount)} KRW")

# 테스트코드 주석처리 해제하고 사용 / crawl.py 테스트코드 주석처리하고 사용
    
# if __name__ == "__main__":
#     s = HanaExchange()
#     s.hana_JPY_KRW()