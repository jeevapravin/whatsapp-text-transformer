document.getElementById("slangBtn").addEventListener("click", async () => {
    const text = document.getElementById("inputText").value;
    if (!text) {
        alert("Please enter some text!");
        return;
    }

    // For demo, let's convert to professional
    const mode = prompt("Type 'professional' or 'genz' to choose style:", "professional");

    const response = await fetch("/slang", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: text, mode: mode })
    });

    const result = await response.json();
    document.getElementById("outputBox").innerText = JSON.stringify(result, null, 2);
});
