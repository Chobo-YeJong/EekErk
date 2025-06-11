# import requests
# from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
# response = requests.get("https://bank.shinhan.com/index.jsp#020501010000")
# html = response.text
# soup = BeautifulSoup(html, 'html.parser')

# 매매기준율 = soup.select_one("#grd_list_1_cell_0_2 > .w2grid_input w2grid_input_readonly").text
# print(매매기준율)

# PBLD_TM = 고시시각(조회시각), PBLD_SQN = 고시회차 DEAL_BASC_RT = 매매기준율, TT_BUY_RT = 전신환매입율(손님이 해외송금 받을 때)
class crawler:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.PBLD_TM = None
        self.PBLD_SQN = None
        self.USD_DEAL_BASC_RT = None
        self.USD_TT_BUY_RT = None
        self.JPY_DEAL_BASC_RT = None
        self.JPY_TT_BUY_RT = None
        time.sleep(3)
        print("크롤러 초기화 완료!")

    def sinhanbank(self):
        # 신한은행 크롤링 정상작동!
        self.driver.get('https://bank.shinhan.com/index.jsp#020501010000')
        time.sleep(3)
        print("신한은행 크롤링 시작!")

        # 고시시각, 고시회차
        PBLD = self.driver.find_element(By.ID, "wq_uuid_1406").text
        self.PBLD_TM = PBLD.split(' ')[0:2]
        self.PBLD_SQN = PBLD.split(' ')[2]
        # 매매기준율, 전신환매입율
        self.USD_DEAL_BASC_RT = self.driver.find_element(By.CSS_SELECTOR, "#grd_list_1_cell_0_2 .w2grid_input.w2grid_input_readonly").text
        self.USD_TT_BUY_RT = self.driver.find_element(By.CSS_SELECTOR, "#grd_list_1_cell_0_3 .w2grid_input.w2grid_input_readonly").text
        self.JPY_DEAL_BASC_RT = self.driver.find_element(By.CSS_SELECTOR, "#grd_list_1_cell_1_2 .w2grid_input.w2grid_input_readonly").text
        self.JPY_TT_BUY_RT = self.driver.find_element(By.CSS_SELECTOR, "#grd_list_1_cell_1_3 .w2grid_input.w2grid_input_readonly").text

    def hanabank(self):
        # 하나은행 크롤링 정상작동!
        self.driver.get('https://www.kebhana.com/cont/mall/mall15/mall1501/index.jsp')
        time.sleep(3)
        iframe = self.driver.find_element(By.TAG_NAME, "iframe")
        self.driver.switch_to.frame(iframe)
        
        print("하나은행 크롤링 시작!")
        # 고시시각, 고시회차
        PBLD = self.driver.find_elements(By.CSS_SELECTOR, ".txtRateBox .fl strong")
        self.PBLD_TM = PBLD[1].text + " " + PBLD[2].text
        self.PBLD_SQN = PBLD[3].text

        # 매매기준율, 전신환매입율 / tr(국가)별로 테이블로 만들어져있음
        tr = self.driver.find_elements(By.CSS_SELECTOR, 'table.tblBasic.leftNone tbody tr')
        usd_tr = tr[0].find_elements(By.CSS_SELECTOR, 'td.txtAr')
        jpy_tr = tr[1].find_elements(By.CSS_SELECTOR, 'td.txtAr')

        self.USD_DEAL_BASC_RT = usd_tr[7].text
        self.USD_TT_BUY_RT = usd_tr[5].text
        self.JPY_DEAL_BASC_RT = jpy_tr[7].text
        self.JPY_TT_BUY_RT = jpy_tr[5].text

# test code / c. 뒤에 은행이름 넣으면 테스트 가능해요!
if __name__ == "__main__":
    c = crawler()
    c.sinhanbank()
    print("고시시각:", c.PBLD_TM)
    print("고시회차:", c.PBLD_SQN)
    print("USD 매매기준율:", c.USD_DEAL_BASC_RT)
    print("USD 전신환매입율:", c.USD_TT_BUY_RT)
    print("JPY 매매기준율:", c.JPY_DEAL_BASC_RT)
    print("JPY 전신환매입율:", c.JPY_TT_BUY_RT)