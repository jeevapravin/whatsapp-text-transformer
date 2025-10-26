# Smart Text Helper

A Chrome extension to instantly clarify slang, adjust text tone, and translate messages on any webpage, including WhatsApp.

---

## The Problem

Ever felt lost reading Gen Z slang? Wished you could quickly translate a message directly within WhatsApp Web? Or needed to understand the real meaning behind a confusing text or emoji?

This extension was built to solve these common communication barriers. Instead of copying text, opening a new tab, and pasting it into an AI chatbot, **Smart Text Helper** brings the power of AI directly to your fingertips.

---

## Features

**Smart Text Helper** adds a new option to your right-click context menu when you select text on any webpage:

- **Clarify Text**: Select any confusing text, slang, or string of emojis, and get a simple, clear explanation.
- **Adjust Tone**: Instantly convert your selected text into two different versions:
  - **Gen Z Slang**: Rewrites the text in a casual, modern slang tone, complete with relevant emojis.
  - **Professional**: Rewrites the text in a formal, professional, and clear tone.
- **Translate Text**: Highlight any message and translate it into dozens of different languages without leaving your current tab.

---
## Preview

![1](image.png)

![2](image-1.png)

## How to Use

1. Highlight (select) any text on a webpage (like a message in WhatsApp Web).
2. Right-click on the highlighted text.
3. Select **Smart Text Helper** from the context menu.
4. The extension popup will open, showing your selected text.
5. Click one of the three buttons:
   - **Clarify Text**: Immediately shows an explanation of the text.
   - **Adjust Tone**: Displays both the "Gen Z" and "Professional" versions of your text.
   - **Translate Text**: An input box will appear. Type your target language (e.g., "Spanish", "Hindi", "Tamil") and press Enter.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Python, Flask  
- **Core AI**: Google Gemini (via API)  
- **Extension**: Chrome Extension (Manifest v3) using Context Menus, Storage, and Action APIs

---

## Local Setup & Installation

### Prerequisites

- Python 3.x  
- pip (Python package installer)  
- A Google Gemini API Key  

---

### 1. Backend Setup (Flask Server)

1. Clone the repository:

```bash
git clone [your-repo-url]
cd whatsapp-text-transformer
```

2. Create and activate a virtual environment:

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up your API Key:

- Create a new file named `.env` in the root of the project folder.  
- Add your Gemini API key:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

5. Run the Flask server:

```bash
python app.py
```

- The server will start at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

### 2. Frontend Setup (Chrome Extension)

1. Open Google Chrome and go to: `chrome://extensions`
2. Toggle **Developer mode** on (top-right corner)
3. Click **Load unpacked** (top-left)
4. Select the entire project folder (the one containing `manifest.json`)
5. **Smart Text Helper** will now be active. Test it by selecting text on any webpage and right-clicking.

---
