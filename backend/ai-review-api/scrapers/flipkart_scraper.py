import requests
from bs4 import BeautifulSoup

def fetch_flipkart_reviews(pid):
    url = f"https://www.flipkart.com/product/p/item?pid={pid}&page=1"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    reviews = []
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    review_blocks = soup.select("div.t-ZTKy")

    for block in review_blocks:
        text = block.get_text(strip=True).replace("READ MORE", "")
        reviews.append(text)

    return reviews[:10]
