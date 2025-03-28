

  
        let recognition;
        let matchCount = 0;
        const startBtn = document.getElementById("startBtn");
        const stopBtn = document.getElementById("stopBtn");
        const resetBtn = document.getElementById("resetBtn");
        const takeVoiceInputBtn = document.getElementById("takeVoiceInputBtn");
        const wordInput = document.getElementById("wordInput");
        const maxCountInput = document.getElementById("maxCountInput");
        const spokenTextElem = document.getElementById("spokenText");
        const matchCountElem = document.getElementById("matchCount");

        function aiClean(input) {
            return input.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim();
        }

        function createFastRecognition() {
            const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            rec.lang = "en-US";
            rec.interimResults = false;
            rec.continuous = true;
            rec.maxAlternatives = 5;
            rec.start();
            return rec;
        }

        function setActive(button, state) {
            if (state) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }

        takeVoiceInputBtn.addEventListener("click", () => {
            setActive(takeVoiceInputBtn, true);
            const inputRec = createFastRecognition();

            inputRec.onresult = event => {
                const word = aiClean(event.results[0][0].transcript);
                wordInput.value = word;
                inputRec.stop();
                setActive(takeVoiceInputBtn, false);
            };

            inputRec.onerror = event => {
                console.error("Voice input error:", event.error);
                setActive(takeVoiceInputBtn, false);
            };
        });

        startBtn.addEventListener("click", () => {
            setActive(startBtn, true);
            recognition = createFastRecognition();

            recognition.onresult = event => {
    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript + " ";
    }

    const result = aiClean(finalText);
    spokenTextElem.textContent = result;

    const targetWord = aiClean(wordInput.value);
    
    // Ensure targetWord is not empty
    if (targetWord.trim() === "") return;

    // Count occurrences of the target word
    let occurrences = (result.match(new RegExp(`\\b${targetWord}\\b`, "gi")) || []).length;

    if (occurrences > 0) {
        matchCount += occurrences;
        matchCountElem.textContent = matchCount;

        const maxCount = parseInt(maxCountInput.value, 10);
        if (!isNaN(maxCount) && matchCount >= maxCount) {
            alert("Maximum count reached!");
            recognition.stop();
            setActive(startBtn, false);
            startBtn.disabled = false;
            stopBtn.disabled = true;
            matchCount = 0;
            matchCountElem.textContent = matchCount;
        }
    }
};



            recognition.onerror = event => console.error("Recognition error:", event.error);

            recognition.onend = () => {
                if (!stopBtn.disabled) recognition.start();
            };

            startBtn.disabled = true;
            stopBtn.disabled = false;
        });

        stopBtn.addEventListener("click", () => {
            if (recognition) recognition.stop();
            setActive(startBtn, false);
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });

        resetBtn.addEventListener("click", () => {
            matchCount = 0;
            matchCountElem.textContent = matchCount;
            spokenTextElem.textContent = "None";
        });
