import requests
from bs4 import BeautifulSoup

def scrape_amazon_reviews(url, limit=10):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "lxml")
    reviews = []

    for review in soup.select("span[data-hook='review-body']")[:limit]:
        text = review.get_text(strip=True)
        if text:
            reviews.append(text)

    return reviews
