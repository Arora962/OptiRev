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

    # Try to fetch real reviews for Amazon/Flipkart using local scrapers
    reviews = []
    used_real_scraper = False
    try:
        # attempt Flipkart
        if "flipkart" in product_url.lower():
            try:
                from utils.extract_id import extract_flipkart_pid
            except Exception:
                from .utils.extract_id import extract_flipkart_pid
            pid = extract_flipkart_pid(product_url)
            if pid:
                try:
                    from scrapers.flipkart_scraper import fetch_flipkart_reviews
                except Exception:
                    from .scrapers.flipkart_scraper import fetch_flipkart_reviews
                reviews = fetch_flipkart_reviews(pid) or []
                used_real_scraper = len(reviews) > 0

        # attempt Amazon
        if (not reviews) and "amazon" in product_url.lower():
            try:
                from utils.scraper import scrape_amazon_reviews
            except Exception:
                from .utils.scraper import scrape_amazon_reviews
            reviews = scrape_amazon_reviews(product_url, limit=50) or []
            used_real_scraper = len(reviews) > 0
    except Exception:
        reviews = []

    # Fallback small sample reviews if scrapers failed
    sample_reviews = [
        "The product quality is amazing and feels premium.",
        "Not worth the money, it stopped working in a week.",
        "Battery life is solid, and the camera is surprisingly good.",
        "Delivery was delayed and packaging was damaged.",
        "Excellent product, user interface is smooth and modern.",
        "Average build quality but good performance for the price.",
        "Terrible customer service, wouldn’t recommend."
    ]

    if not reviews:
        reviews = sample_reviews[:]

    positive_keywords = ["good", "great", "amazing", "excellent", "premium", "smooth", "recommend", "solid", "love", "best", "awesome", "fantastic"]
    negative_keywords = ["bad", "poor", "terrible", "disappointing", "not", "stopped", "delayed", "damaged", "awful", "worst", "hate", "problem"]

    total = len(reviews)

    # classify each review by simple keyword counts and compute per-review polarity
    review_sentiments = []
    for r in reviews:
        rl = r.lower()
        pos_matches = sum(rl.count(k) for k in positive_keywords)
        neg_matches = sum(rl.count(k) for k in negative_keywords)
        if pos_matches > neg_matches:
            cls = "positive"
        elif neg_matches > pos_matches:
            cls = "negative"
        else:
            cls = "neutral"
        # polarity normalized between -1 and 1
        polarity = 0.0
        if pos_matches + neg_matches > 0:
            polarity = (pos_matches - neg_matches) / (pos_matches + neg_matches)
        review_sentiments.append({"text": r, "class": cls, "polarity": polarity, "pos": pos_matches, "neg": neg_matches})

    positive_count = sum(1 for s in review_sentiments if s["class"] == "positive")
    negative_count = sum(1 for s in review_sentiments if s["class"] == "negative")
    neutral_count = sum(1 for s in review_sentiments if s["class"] == "neutral")

    positive_percent = round((positive_count / total) * 100, 1) if total else 0.0
    negative_percent = round((negative_count / total) * 100, 1) if total else 0.0
    neutral_percent = round((neutral_count / total) * 100, 1) if total else 0.0

    # derive pros/cons from review_sentiments
    def uniq_keep_order(seq):
        seen = set()
        out = []
        for x in seq:
            if x not in seen:
                seen.add(x)
                out.append(x)
        return out

    pros = uniq_keep_order([s["text"] for s in review_sentiments if s["class"] == "positive"])[:8]
    cons = uniq_keep_order([s["text"] for s in review_sentiments if s["class"] == "negative"])[:8]

    tone = "Neutral"
    if positive_count > negative_count:
        tone = "Positive"
    elif negative_count > positive_count:
        tone = "Negative"

    # create short, human-friendly pros/cons summaries (trim to first 10 words)
    def short_snippet(s, max_words=10):
        parts = s.split()
        if len(parts) <= max_words:
            return s
        return " ".join(parts[:max_words]).rstrip(".,") + "..."

    pros_short = [short_snippet(p, 10) for p in pros] or ["Good performance"]
    cons_short = [short_snippet(c, 10) for c in cons] or ["Some users reported issues"]

    # Extractive summary: score sentences from reviews by word frequency
    import re

    # build word frequency excluding common stopwords
    stopwords = set(["the","and","is","in","it","of","we","a","an","to","for","with","that","this","on","was","are","as","but","be","have","has"])
    freq = {}
    sentences = []
    for r in reviews:
        # split into sentences
        pieces = re.split(r'[\.\!\?]+\s*', r.strip())
        for s in pieces:
            s = s.strip()
            if not s:
                continue
            sentences.append(s)
            for w in re.findall(r"\w+", s.lower()):
                if w in stopwords:
                    continue
                freq[w] = freq.get(w, 0) + 1

    def score_sentence(s):
        return sum(freq.get(w, 0) for w in re.findall(r"\w+", s.lower()))

    # rank sentences and take top 2-3
    ranked = sorted(sentences, key=score_sentence, reverse=True)
    top_sentences = uniq_keep_order(ranked)[:3]

    if top_sentences:
        summary_body = " ".join(top_sentences)
        summary = f"{summary_body} Overall sentiment is {tone.lower()}: {positive_percent}% positive, {neutral_percent}% neutral, {negative_percent}% negative (based on {total} reviews)."
    else:
        summary = f"Across {total} reviews analyzed, sentiment is {tone.lower()} — {positive_percent}% positive, {neutral_percent}% neutral and {negative_percent}% negative."

    # More realistic rating computed from average polarity across reviews
    avg_polarity = sum(s["polarity"] for s in review_sentiments) / (len(review_sentiments) or 1)
    # map avg_polarity (-1..1) to 1..5
    rating = round(((avg_polarity + 1) / 2) * 4 + 1, 1)
    rating = max(1.0, min(5.0, rating))

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
