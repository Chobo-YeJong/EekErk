import math

def convert_usd_to_krw(usd_amount, exchange_rate):
    fee_rate = 0.01  # 1% 수수료
    
    # ① 환산 금액
    krw_raw = usd_amount * exchange_rate

    # ② 원화 환산 금액: 1원 미만 절사
    krw_converted = math.floor(krw_raw)

    # ③ 수수료 계산 후 절사
    fee = math.floor(krw_converted * fee_rate)

    # ④ 최종 입금액
    krw_final = krw_converted - fee

    return krw_final, krw_converted, fee

