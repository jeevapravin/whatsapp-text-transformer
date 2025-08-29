from flask import Flask, request, jsonify, render_template
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

HF_API_KEY = os.getenv("HF_API_KEY")

# Translation model
TRANSLATION_URL = "https://api-inference.huggingface.co/models/facebook/m2m100_418M"
# Slang conversion model
SLANG_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"

headers = {"Authorization": f"Bearer {HF_API_KEY}"}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text", "")
    payload = {"inputs": text}
    response = requests.post(TRANSLATION_URL, headers=headers, json=payload)
    return jsonify(response.json())

@app.route("/slang", methods=["POST"])
def slang():
    data = request.json
    text = data.get("text", "")
    mode = data.get("mode", "professional")  # default

    if mode == "professional":
        prompt = f"Rewrite this in professional formal English: {text}"
    else:
        prompt = f"Rewrite this in casual Gen Z slang: {text}"

    payload = {"inputs": prompt}
    response = requests.post(SLANG_URL, headers=headers, json=payload)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
