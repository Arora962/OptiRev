import re

def extract_amazon_asin(url):
    match = re.search(r"/([A-Z0-9]{10})(?:[/?]|$)", url)
    return match.group(1) if match else None

def extract_flipkart_pid(url):
    match = re.search(r"pid=([A-Za-z0-9]+)", url)
    return match.group(1) if match else None
