from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return jsonify({"message": "Mock AI API is running successfully!"})


@app.route('/preview', methods=['POST'])
def preview():
    data = request.json or {}
    product_url = data.get('product_url') or request.args.get('product_url')

    if not product_url:
        return jsonify({"error": "Product URL missing"}), 400

    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(product_url, headers=headers, timeout=8)
        resp.raise_for_status()
    except Exception as e:
        return jsonify({"error": f"Unable to fetch URL: {str(e)}"}), 400

    try:
        soup = BeautifulSoup(resp.text, "html.parser")

        def og(prop):
            tag = soup.find("meta", property=prop)
            if tag and tag.get("content"):
                return tag.get("content")
            tag = soup.find("meta", attrs={"name": prop})
            return tag.get("content") if tag and tag.get("content") else None

        title = og("og:title") or (soup.title.string if soup.title else "")
        description = og("og:description") or og("description") or ""
        image = og("og:image") or ""

        preview_data = {"title": title, "description": description, "image": image, "url": product_url}
        return jsonify(preview_data)
    except Exception as e:
        return jsonify({"error": f"Failed to parse preview: {str(e)}"}), 500


@app.route('/analyze', methods=['POST'])
def analyze_review():
    data = request.json or {}
    product_url = data.get("product_url")

    if not product_url:
        return jsonify({"error": "Product URL missing"}), 400

    # get product preview/meta to show description
    def fetch_preview_info(url):
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            r = requests.get(url, headers=headers, timeout=8)
            r.raise_for_status()
            s = BeautifulSoup(r.text, "html.parser")

            def og(prop):
                tag = s.find("meta", property=prop)
                if tag and tag.get("content"):
                    return tag.get("content")
                tag = s.find("meta", attrs={"name": prop})
                return tag.get("content") if tag and tag.get("content") else None

            title = og("og:title") or (s.title.string if s.title else "")
            description = og("og:description") or og("description") or ""
            image = og("og:image") or ""
            return {"title": title, "description": description, "image": image}
        except Exception:
            return {"title": "", "description": "", "image": ""}

    preview_info = fetch_preview_info(product_url)

    # Use small sample reviews for sentiment analysis (can be replaced with real scrapers later)
    sample_reviews = [
        "The product quality is amazing and feels premium.",
        "Not worth the money, it stopped working in a week.",
        "Battery life is solid, and the camera is surprisingly good.",
        "Delivery was delayed and packaging was damaged.",
        "Excellent product, user interface is smooth and modern.",
        "Average build quality but good performance for the price.",
        "Terrible customer service, wouldn’t recommend."
    ]

    positive_keywords = ["good", "great", "amazing", "excellent", "premium", "smooth", "recommend", "solid", "love", "best"]
    negative_keywords = ["bad", "poor", "terrible", "disappointing", "not", "stopped", "delayed", "damaged", "awful", "worst"]

    positive_count = sum(any(word in r.lower() for word in positive_keywords) for r in sample_reviews)
    negative_count = sum(any(word in r.lower() for word in negative_keywords) for r in sample_reviews)
    total = len(sample_reviews)

    positive_percent = round((positive_count / total) * 100, 1)
    negative_percent = round((negative_count / total) * 100, 1)
    neutral_percent = round(100 - positive_percent - negative_percent, 1)

    # derive pros/cons heuristically
    pros = [r for r in sample_reviews if any(k in r.lower() for k in positive_keywords)][:6] or ["Good performance"]
    cons = [r for r in sample_reviews if any(k in r.lower() for k in negative_keywords)][:6] or ["Some users reported issues"]

    tone = "Neutral"
    if positive_count > negative_count:
        tone = "Positive"
    elif negative_count > positive_count:
        tone = "Negative"

    # Compose summary that includes the product description/title if available
    summary_parts = []
    if preview_info.get("title"):
        summary_parts.append(preview_info.get("title"))
    if preview_info.get("description"):
        d = preview_info.get("description").strip()
        if len(d) > 240:
            d = d[:237].rsplit(" ", 1)[0] + "..."
        summary_parts.append(d)

    summary_parts.append(f"Across {total} reviews analyzed, sentiment is {tone.lower()} — {positive_percent}% positive, {neutral_percent}% neutral and {negative_percent}% negative.")
    summary = " ".join(summary_parts)

    # heuristic rating
    if positive_count > negative_count:
        rating = round(min(5.0, 3.8 + (positive_percent / 40)), 1)
    elif negative_count > positive_count:
        rating = round(max(1.0, 3.6 - (negative_percent / 40)), 1)
    else:
        rating = 3.8

    response = {
        "product_url": product_url,
        "title": preview_info.get("title"),
        "description": preview_info.get("description"),
        "image": preview_info.get("image"),
        "summary": summary,
        "rating": rating,
        "tone": tone,
        "sentiment_breakdown": {"positive": positive_percent, "negative": negative_percent, "neutral": neutral_percent},
        "pros": pros,
        "cons": cons,
        "review_count": total
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
