document.getElementById('generate').addEventListener('click', generate);

function showConfig(type) {
    document.getElementById('passwordConfig').style.display = type === 'password' ? 'block' : 'none';
    document.getElementById('passphraseConfig').style.display = type === 'passphrase' ? 'block' : 'none';
    document.getElementById('pinConfig').style.display = type === 'pin' ? 'block' : 'none';
    document.getElementById('generate').setAttribute('data-type', type);

    document.querySelectorAll('.button-container button').forEach(button => {
        button.classList.remove('selected');
    });

    document.getElementById(type + 'Button').classList.add('selected');

    generate();
}

function generate() {
    const type = document.getElementById('generate').getAttribute('data-type');
    if (type === 'password') {
        generatePassword();
    } else if (type === 'passphrase') {
        generatePassphrase();
    } else if (type === 'pin') {
        generatePin();
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const noSequential = document.getElementById('noSequential').checked;

    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let charset = lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    if (includeUppercase) charset += uppercase;

    let password = "";
    while (password.length < length) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        const char = charset[randomIndex];
        if (password.length === 0 && symbols.includes(char)) continue;
        if (noSequential && password.length > 0 && (password.charAt(password.length - 1) === char || Math.abs(password.charCodeAt(password.length - 1) - char.charCodeAt(0)) === 1)) continue;
        password += char;
    }
    displayResult(password);
}

function generatePassphrase() {
    const amountOfWords = parseInt(document.getElementById('passphraseWords').value);
    const capitalizeFirst = document.getElementById('capitalizeFirst').checked;
    const includeNumbers = document.getElementById('includeNumbersPassphrase').checked;
    const includeSymbols = document.getElementById('includeSymbolsPassphrase').checked;

    fetch(`https://random-word-api.herokuapp.com/word?number=${amountOfWords}`)
        .then(response => response.json())
        .then(words => {
            const passphrase = words.map((word, index) => {
                if (capitalizeFirst) word = word.charAt(0).toUpperCase() + word.slice(1);
                if (index % 2 === 0) {
                    if (includeNumbers && Math.random() > 0.5) {
                        word += Math.floor(Math.random() * 10);
                    } else if (includeSymbols) {
                        word += "!@#$%^&*".charAt(Math.floor(Math.random() * 8));
                    }
                }
                return word;
            });
            displayResult(passphrase.join('-'));
        })
        .catch(error => {
            alert("Failed to fetch words. Please try again.");
            console.error(error);
        });
}

function generatePin() {
    const length = parseInt(document.getElementById('pinLength').value);
    let pin = "";
    for (let i = 0; i < length; i++) {
        pin += Math.floor(Math.random() * 10);
    }
    displayResult(pin);
}

function displayResult(result) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = result;

    if (copyCount >= 11) {
        resultElement.className = 'beyond-godlike';
    } else {
        resultElement.classList.remove('bounce');
        void resultElement.offsetWidth;
        resultElement.classList.add('bounce');
    }
}


let copyCount = 0;
let originalResult = "";

function copyToClipboard() {
    const resultElement = document.getElementById('result');

    if (!originalResult) {
        originalResult = resultElement.textContent;
    }

    navigator.clipboard.writeText(originalResult).then(() => {
        copyCount++;
        let message = "Copied!";
        resultElement.className = "";

        if (copyCount === 2) message = "Double Copy!";
        else if (copyCount === 3) message = "Triple Copy!";
        else if (copyCount === 4) message = "Dominating!!";
        else if (copyCount === 5) message = "Rampage!!";
        else if (copyCount === 6) message = "Mega Copy!!";
        else if (copyCount === 7) message = "Unstoppable!!";
        else if (copyCount === 8) message = "Wicked Sick!!";
        else if (copyCount === 9) message = "Monster Copy!!!";
        else if (copyCount === 10) {
            message = "Godlike!!!";
            resultElement.classList.add("godlike");
        } else if (copyCount >= 11) {
            message = "BEYOND GODLIKE!!!";
            resultElement.classList.add("beyond-godlike");
        }

        resultElement.textContent = message;

        clearTimeout(copyToClipboard.timeout);
        copyToClipboard.timeout = setTimeout(() => {
            resultElement.textContent = originalResult;
            resultElement.className = "";
            copyCount = 0;
            originalResult = "";
        }, 500);
    });
}


function updatePasswordLength() {
    const slider = document.getElementById('passwordLengthSlider');
    const numberInput = document.getElementById('passwordLength');
    numberInput.value = slider.value;
}

function updatePasswordLengthSlider() {
    const slider = document.getElementById('passwordLengthSlider');
    const numberInput = document.getElementById('passwordLength');
    slider.value = numberInput.value;
}

function updatePassphraseWords() {
    const slider = document.getElementById('passphraseWordsSlider');
    const numberInput = document.getElementById('passphraseWords');
    numberInput.value = slider.value;
}

function updatePassphraseWordsSlider() {
    const slider = document.getElementById('passphraseWordsSlider');
    const numberInput = document.getElementById('passphraseWords');
    slider.value = numberInput.value;
}

function updatePinLength() {
    const slider = document.getElementById('pinLengthSlider');
    const numberInput = document.getElementById('pinLength');
    numberInput.value = slider.value;
}

function updatePinLengthSlider() {
    const slider = document.getElementById('pinLengthSlider');
    const numberInput = document.getElementById('pinLength');
    slider.value = numberInput.value;
}

showConfig('password');
