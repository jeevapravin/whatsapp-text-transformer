from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

HF_API_KEY = os.getenv("HF_API_KEY")
HF_URL = "https://api-inference.huggingface.co/models/facebook/m2m100_418M"

headers = {"Authorization": f"Bearer {HF_API_KEY}"}

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text", "")
    payload = {"inputs": text}
    response = requests.post(HF_URL, headers=headers, json=payload)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
