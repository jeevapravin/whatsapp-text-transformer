import os
import requests
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Gemini API Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
headers = {"Content-Type": "application/json"}

def query_gemini(prompt):
    if not GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY not found in .env file."

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        response = requests.post(MODEL_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        text = data['candidates'][0]['content']['parts'][0]['text']
        return text.strip()
    except requests.exceptions.RequestException as e:
        error_details = str(e)
        try:
            error_details = response.json().get('error', {}).get('message', str(e))
        except:
            pass
        return f"Error: Failed to connect to the Gemini API. Details: {error_details}"
    except (KeyError, IndexError):
        return "Error: Could not parse the response from the Gemini API."
    except Exception as e:
        return f"Error: An unexpected error occurred: {e}"

@app.route("/")
def home():
    return "Flask server is running for the Smart Text Helper extension."

@app.route("/api/clarify", methods=["POST"])
def clarify_text():
    text = request.json.get("text", "")
    if not text:
        return jsonify({"result": "Error: No text provided"}), 400
    prompt = f"Explain the slang and emojis in this text in simple terms: '{text}'"
    result = query_gemini(prompt)
    return jsonify({"result": result})

@app.route("/api/slang", methods=["POST"])
def change_slang():
    text = request.json.get("text", "")
    if not text:
        return jsonify({"result": "Error: No text provided"}), 400
    
    # --- THIS IS THE NEW, STRICTER PROMPT ---
    prompt = f"""For the following text, provide two versions: one in casual Gen Z slang with emojis, and one in a formal, professional tone.
Your response MUST be ONLY in the following format, with each on a new line:
Gen Z: [slang version]
Professional: [professional version]

Text: "{text}"
"""
    
    result = query_gemini(prompt)
    return jsonify({"result": result})

@app.route("/api/translate", methods=["POST"])
def translate_text():
    text = request.json.get("text", "")
    language = request.json.get("language")
    if not text or not language:
        return jsonify({"result": "Error: Text and target language are required"}), 400
    
    prompt = f"Translate the following text to {language}. Provide ONLY the translated text itself, with no explanations, notes, or additional commentary. Text: '{text}'"
    
    result = query_gemini(prompt)
    return jsonify({"result": result})

if __name__ == "__main__":
    if not GEMINI_API_KEY:
        print("Warning: GEMINI_API_KEY is not set in your .env file.")
    app.run(debug=True)