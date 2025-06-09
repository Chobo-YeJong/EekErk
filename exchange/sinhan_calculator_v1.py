def calculate_exchanged_amount(base_rate, sell_rate, amount, discount_rate):
    """
    base_rate: 기준 환율 (100% 우대)
    sell_rate: 매도율 (0% 우대)
    amount: 환전할 외화 금액 (예: 100)
    discount_rate: 우대율 (0.5 for 50%)
    """
    exchange_rate = sell_rate - (sell_rate - base_rate) * discount_rate
    return round(exchange_rate * amount)


print(calculate_exchanged_amount(1363.00, 1350.00, 1, 0.5))