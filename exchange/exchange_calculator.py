

def buy_FX_calculate() : 
    # 현재 환율	current exchange rate (or foreign exchange rate)
    # 환전 우대율(%) preferential exchange rate
    # 환전 수수료(%) exchange fee rate (or commission rate)
    print ("환전 구매 환율을 계산합니다.")

    exchange_rate = float(input("현재 환율을 입력하세요 (예 1234.56):"))

    preferential_rate = float(input("환전 우대율을 입력하세요 %를 제외하고(예 100, 90, 80, ... 0):"))

    exchange_fee = float(input("환전 수수료/스프레드를 입력하세요 (예 1.75, 1.5):"))
    
    # 수수료와 우대율을 계산한 구매 환율 buy_FX_rate
    buy_FX_rate = exchange_rate * (1 + (exchange_fee * (1 - preferential_rate / 100)) / 100)

    print (f"수수료, 우대율이 적용된 구매 환율은 {buy_FX_rate:.2f}입니다.")
    
    return buy_FX_rate

def sell_FX_calculate() : 
    # 현재 환율	current exchange rate (or foreign exchange rate)
    # 환전 우대율(%) preferential exchange rate
    # 환전 수수료(%) exchange fee rate (or commission rate)
    print ("환전 판매 환율을 계산합니다.")

    exchange_rate = float(input("현재 환율을 입력하세요 (예 1234.56):"))

    preferential_rate = float(input("환전 우대율을 입력하세요 %를 제외하고(예 100, 90, 80, ... 0):"))

    exchange_fee = float(input("환전 수수료/스프레드를 입력하세요 (예 1.75, 1.5):"))
    
    # 수수료와 우대율을 계산한 판매 환율 sell_FX_rate
    sell_FX_rate = exchange_rate * (1 + (exchange_fee * (1 + preferential_rate / 100)) / 100)

    print (f"수수료, 우대율이 적용된 판매 환율은 {sell_FX_rate:.2f}입니다.")
    
    return sell_FX_rate


print(buy_FX_calculate())
print(sell_FX_calculate())
