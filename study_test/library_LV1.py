# 1개 상품 크롤링(select_one은 첫 번째 요소만 가져옴)
import requests
from bs4 import BeautifulSoup

response = requests.get("https://startcoding.pythonanywhere.com/basic")
html = response.text
soup = BeautifulSoup(html, 'html.parser')

category = soup.select_one(".product-category").text
name = soup.select_one(".product-name").text
link = soup.select_one(".product-name > a").text

# strip은 문자열 양쪽의 공백을 제거, replace는 문자열 내의 특정 문자를 다른 문자로 대체
price = soup.select_one(".product-price").text.strip().replace(",", "").replace("원", "")

print(category, name, link, price)
