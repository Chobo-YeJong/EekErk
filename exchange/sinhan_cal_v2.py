import math

def round_to_two_decimals(value):
    """소수점 셋째 자리에서 반올림하여 소수점 둘째 자리까지 표시합니다."""
    return math.floor(value * 100 + 0.5) / 100 # Banker's rounding이 아닌 일반적인 반올림

def calculate_exchange(
    foreign_currency_amount: float,
    preferential_rate_percent: float,
    base_rate_per_unit: float, # 전신환 매입율 (0% 우대 시 적용)
    benchmark_rate_per_unit: float, # 매매기준율 (100% 우대 시 적용)
    currency_unit: int = 100 # 엔화는 100, 달러는 1
):
    """
    외화 환전 금액을 계산합니다.

    Args:
        foreign_currency_amount (float): 환전하려는 외화 금액.
        preferential_rate_percent (float): 적용할 우대율 (0~100).
        base_rate_per_unit (float): 1 단위 외화당 전신환 매입율 (0% 우대 시 적용).
        benchmark_rate_per_unit (float): 1 단위 외화당 매매기준율 (100% 우대 시 적용).
        currency_unit (int): 외화 단위 (엔화는 100, 달러는 1).

    Returns:
        dict: 적용 환율, 최종 원화 금액, 우대금액을 포함하는 딕셔너리.
    """
    if not (0 <= preferential_rate_percent <= 100):
        raise ValueError("우대율은 0에서 100 사이여야 합니다.")
    if foreign_currency_amount <= 0:
        raise ValueError("환전하려는 외화 금액은 0보다 커야 합니다.")
    if base_rate_per_unit <= 0 or benchmark_rate_per_unit <= 0:
        raise ValueError("환율은 0보다 커야 합니다.")

    # 1단계: 총 스프레드 계산
    total_spread = benchmark_rate_per_unit - base_rate_per_unit

    # 2단계: 우대율이 적용된 '단위당 적용 환율' 계산 (소수점 셋째 자리 반올림)
    preferential_rate_decimal = preferential_rate_percent / 100.0
    
    # 정밀한 적용 환율 계산 (표시되는 적용 환율)
    applicable_rate_per_unit_precise = base_rate_per_unit + (total_spread * preferential_rate_decimal)
    applicable_rate_per_unit_display = round_to_two_decimals(applicable_rate_per_unit_precise) # 실제 표시되는 환율

    # 3단계: 최종 '환전 원화 금액' 계산 (소수점 셋째 자리 반올림)
    krw_amount_precise = (foreign_currency_amount / currency_unit) * applicable_rate_per_unit_display
    final_krw_amount = round_to_two_decimals(krw_amount_precise)

    # 4단계: '0% 우대 시 원화 금액' 계산 (우대금액 산출용)
    krw_amount_0_pref_precise = (foreign_currency_amount / currency_unit) * base_rate_per_unit
    krw_amount_0_pref = round_to_two_decimals(krw_amount_0_pref_precise)

    # 5단계: '우대금액' 계산
    preferential_gain_amount = round_to_two_decimals(final_krw_amount - krw_amount_0_pref)
    
    return {
        "applicable_rate": applicable_rate_per_unit_display,
        "final_krw_amount": final_krw_amount,
        "preferential_gain_amount": preferential_gain_amount
    }

# --- 사용자 입력 및 실행 ---
if __name__ == "__main__":
    print("--- 외화 환전 계산기 ---")

    # 환율 정보 입력
    while True:
        try:
            input_currency_type = input("환전할 외화 종류를 선택하세요 (JPY 또는 USD): ").upper()
            if input_currency_type not in ["JPY", "USD"]:
                raise ValueError("JPY 또는 USD 중 하나를 입력해주세요.")

            benchmark_rate_input = float(input(f"{input_currency_type} 매매기준율을 입력하세요 (예: JPY는 940.38, USD는 1363): "))
            base_rate_input = float(input(f"{input_currency_type} 전신환 매입율을 입력하세요 (예: JPY는 931.36, USD는 1350): "))
            break
        except ValueError as e:
            print(f"오류: {e}. 다시 입력해주세요.")

    currency_unit_val = 100 if input_currency_type == "JPY" else 1

    # 환전 정보 입력
    while True:
        try:
            foreign_amount = float(input(f"환전할 {input_currency_type} 금액을 입력하세요: "))
            preferential_rate = float(input("적용할 우대율을 입력하세요 (예: 0, 10, 50, 70, 100): "))
            break
        except ValueError as e:
            print(f"오류: {e}. 다시 입력해주세요.")

    # 계산 실행
    try:
        result = calculate_exchange(
            foreign_amount,
            preferential_rate,
            base_rate_input,
            benchmark_rate_input,
            currency_unit_val
        )

        print("\n--- 환전 결과 ---")
        if input_currency_type == "JPY":
            print(f"100 JPY당 적용 환율: {result['applicable_rate']:.2f} KRW")
        else:
            print(f"1 USD당 적용 환율: {result['applicable_rate']:.2f} KRW")
        print(f"최종 환전 원화 금액: {result['final_krw_amount']:.2f} KRW")
        print(f"우대금액: {result['preferential_gain_amount']:.2f} KRW")

    except ValueError as e:
        print(f"계산 오류: {e}")