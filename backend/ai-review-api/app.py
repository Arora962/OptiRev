from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Mock AI API is running successfully!"})

@app.route('/analyze', methods=['POST'])
def analyze_review():
    data = request.json
    product_url = data.get("product_url")

    if not product_url:
        return jsonify({"error": "Product URL missing"}), 400

    # Pretend-scraped reviews
    sample_reviews = [
        "The product quality is amazing and feels premium.",
        "Not worth the money, it stopped working in a week.",
        "Battery life is solid, and the camera is surprisingly good.",
        "Delivery was delayed and packaging was damaged.",
        "Excellent product, user interface is smooth and modern.",
        "Average build quality but good performance for the price.",
        "Terrible customer service, wouldn’t recommend."
    ]

    # Simple sentiment scoring
    positive_keywords = ["good", "great", "amazing", "excellent", "premium", "smooth", "recommend", "solid"]
    negative_keywords = ["bad", "poor", "terrible", "disappointing", "not", "stopped", "delayed", "damaged"]

    positive_count = sum(any(word in r.lower() for word in positive_keywords) for r in sample_reviews)
    negative_count = sum(any(word in r.lower() for word in negative_keywords) for r in sample_reviews)
    total = len(sample_reviews)

    positive_percent = round((positive_count / total) * 100, 1)
    negative_percent = round((negative_count / total) * 100, 1)
    neutral_percent = round(100 - positive_percent - negative_percent, 1)

    # AI-like summary generation
    if positive_count > negative_count:
        tone = "positive"
        summary = (
            "The overall sentiment is upbeat. Customers praise the build quality, design, and performance. "
            "Some minor issues like delivery delays or packaging flaws were mentioned."
        )
        rating = round(random.uniform(4.0, 4.6), 1)
        pros = ["Good performance", "Attractive design", "Premium quality"]
        cons = ["Minor delivery issues", "Average packaging"]
    elif negative_count > positive_count:
        tone = "negative"
        summary = (
            "Overall sentiment leans negative. Users faced performance issues and inconsistent quality. "
            "A few praised aspects like design or usability, but problems outweighed the positives."
        )
        rating = round(random.uniform(2.5, 3.4), 1)
        pros = ["Nice design", "User-friendly interface"]
        cons = ["Performance issues", "Poor customer support", "Durability concerns"]
    else:
        tone = "neutral"
        summary = (
            "Reviews are mixed. Some users appreciated the product’s performance, while others pointed out "
            "minor defects or delays. The experience seems to vary across customers."
        )
        rating = 3.8
        pros = ["Balanced performance", "Decent value"]
        cons = ["Inconsistent experience", "Build quality varies"]

    response = {
        "product_url": product_url,
        "summary": summary,
        "rating": rating,
        "tone": tone.capitalize(),
        "sentiment_breakdown": {
            "positive": positive_percent,
            "negative": negative_percent,
            "neutral": neutral_percent
        },
        "pros": pros,
        "cons": cons,
        "review_count": total
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
