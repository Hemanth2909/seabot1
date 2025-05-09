document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateBtn");
    const userInput = document.getElementById("text-input"); // Fix: Reference correctly
    const aiOutput = document.getElementById("aiOutput");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const predictionsDiv = document.getElementById("predictions");

    const knowledgeBase = {
        greetings: ["Hello! How can I assist you today?", "Hi there!", "Greetings! I'm here to help."],
        questions: {
            "name": "I'm an AI text generator created to demonstrate basic functionality.",
            "age": "I don't have an age as I'm just a program.",
            "weather": "I can't check live data, but I hope the weather is nice where you are!",
            "default": "That's an interesting question. I'll do my best to help!"
        },
        jokes: [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
            "Why don't skeletons fight each other? They don't have the guts!"
        ]
    };

    generateBtn.addEventListener("click", function () {
        const inputText = userInput.value.trim().toLowerCase();

        if (!inputText) {
            aiOutput.textContent = "Please enter a prompt.";
            return;
        }

        loadingIndicator.style.display = "flex";
        aiOutput.textContent = "";

        setTimeout(() => {
            aiOutput.textContent = generateResponse(inputText);
            loadingIndicator.style.display = "none";
        }, 1500);
    });

    function generateResponse(input) {
        if (input.includes("joke") || input.includes("funny")) {
            return getRandomResponse(knowledgeBase.jokes);
        }
    
        for (const [key, responses] of Object.entries(knowledgeBase)) {
            if (Array.isArray(responses) && key === "greetings" && responses.some(resp => input.includes(resp.toLowerCase()))) {
                return getRandomResponse(responses);
            }
            if (typeof responses === "object" && Object.keys(responses).some(q => input.includes(q))) {
                return responses[Object.keys(responses).find(q => input.includes(q))] || responses.default;
            }
        }
        return knowledgeBase.questions.default;
    }
    

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    const wordPredictions = {
        "hello": { "world": 0.6, "there": 0.3, "how": 0.08, "friend": 0.02 },
        "how": { "are": 0.7, "is": 0.2, "do": 0.07, "can": 0.03 }
    };

    userInput.addEventListener("input", updatePredictions); // Fix: Target correctly

    function updatePredictions() {
        const text = userInput.value.trim();
        const words = text.split(/\s+/);
        const lastWord = words.length > 0 ? words[words.length - 1].toLowerCase() : "";

        predictionsDiv.innerHTML = "";

        let predictions = wordPredictions[lastWord]
            ? Object.entries(wordPredictions[lastWord]).map(([word, prob]) => ({ word, prob })).sort((a, b) => b.prob - a.prob)
            : [];

        predictions.slice(0, 5).forEach(({ word, prob }) => {
            const button = document.createElement("button");
            button.className = "prediction-btn";
            button.textContent = word;
            const probBadge = document.createElement("span");
            probBadge.className = "probability";
            probBadge.textContent = Math.round(prob * 100);
            button.appendChild(probBadge);

            button.addEventListener("click", () => {
                userInput.value += userInput.value.endsWith(" ") ? `${word} ` : ` ${word}`;
                userInput.focus();
                updatePredictions();
            });

            predictionsDiv.appendChild(button);
        });
    }
});
