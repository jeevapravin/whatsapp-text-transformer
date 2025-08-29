document.addEventListener("DOMContentLoaded", () => {
  const expandBtn = document.getElementById("expand");
  const slangBtn = document.getElementById("change-slang");
  const translateBtn = document.getElementById("translate");
  const translateInput = document.getElementById("translateInput");
  const allButtons = document.querySelectorAll('.btn');
  let outputBox = null;

  // --- UI Effects ---
  allButtons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * -6;
      btn.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
  });

  translateBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    translateInput.classList.toggle("hidden");
    if (!translateInput.classList.contains("hidden")) {
      translateInput.focus();
    }
  });

  // --- Backend Communication ---
  const getOutputBox = () => {
    if (!outputBox) {
      outputBox = document.createElement('div');
      outputBox.id = 'outputBox';
      Object.assign(outputBox.style, {
        background: 'rgba(20, 20, 20, 0.8)', padding: '15px', borderRadius: '12px',
        minHeight: '50px', marginTop: '20px', textAlign: 'left', color: '#e9edef',
        border: '1px solid rgba(37, 211, 102, 0.4)', wordWrap: 'break-word',
        fontSize: '14px', lineHeight: '1.5', transition: 'opacity 0.3s ease'
      });
      document.body.appendChild(outputBox);
    }
    outputBox.textContent = '';
    outputBox.style.opacity = '1';
    return outputBox;
  };

  async function postData(url, data) {
    const display = getOutputBox();
    display.textContent = 'Processing...';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return { result: `Error: Could not connect to the service. ${error.message}` };
    }
  }

  // --- Core Extension Logic ---
  let highlightedText = "";

  function initializePopup(selectedText) {
    highlightedText = selectedText;
    if (!highlightedText) {
      const display = getOutputBox();
      display.textContent = "To begin, highlight some text on a webpage and right-click to use the Smart Text Helper.";
    } else {
        const display = getOutputBox();
        display.textContent = `Selected Text: "${highlightedText}"`;
    }
  }

  // --- Event Listeners ---
  expandBtn.addEventListener("click", async () => {
    if (!highlightedText) return;
    const data = await postData('http://127.0.0.1:5000/api/clarify', { text: highlightedText });
    getOutputBox().textContent = data.result || "No clarification available.";
  });

  slangBtn.addEventListener("click", async () => {
    if (!highlightedText) return;
    const data = await postData('http://127.0.0.1:5000/api/slang', { text: highlightedText });
    getOutputBox().textContent = data.result || "No adjustment available.";
  });

  translateInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      if (!highlightedText) return;
      const lang = translateInput.value.trim();
      if (lang) {
        const data = await postData('http://127.0.0.1:5000/api/translate', { text: highlightedText, language: lang });
        getOutputBox().textContent = data.result || "Translation failed.";
        translateInput.value = '';
        translateInput.classList.add('hidden');
      } else {
        getOutputBox().textContent = "Please enter a target language first.";
      }
    }
  });

  // Retrieve the text from storage when the popup opens.
  chrome.storage.local.get("selectedText", (data) => {
    if (data.selectedText) {
      initializePopup(data.selectedText);
      chrome.storage.local.remove("selectedText");
    } else {
      initializePopup("");
    }
  });
});