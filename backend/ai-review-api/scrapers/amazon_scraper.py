import re

def extract_amazon_asin(url):
    # Handles multiple URL patterns
    patterns = [
        r'/dp/([A-Z0-9]{10})',
        r'/gp/product/([A-Z0-9]{10})',
        r'/product/([A-Z0-9]{10})',
        r'/ASIN/([A-Z0-9]{10})',
        r'/([A-Z0-9]{10})(?:[/?]|$)'
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None


def extract_flipkart_pid(url):
    match = re.search(r'p/itm([a-zA-Z0-9]+)', url)
    return match.group(0) if match else None
