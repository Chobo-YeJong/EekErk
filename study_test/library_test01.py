# requtests 라이브러리, BeautifulSoup 호출
import requests
from bs4 import BeautifulSoup

# response = requests.get("링크주소") 해서 불러오고, print(response.status_code) 하면 상태 확인, 200은 제대로 불러온것 404는 없는페이지
response = requests.get("https://startcoding.pythonanywhere.com/basic")
print(response.status_code)
html = response.text
soup = BeautifulSoup(html, 'html.parser')

#f12 눌러서 원하는거 찾고 .선택자 입력하기
soup.select_one(".brand-name")
soup.select_one(".brand-name").text
soup.select_one(".brand-name").attrs
