const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-button');
const entryTypePrompt = document.getElementById('entry-type-prompt');
const entryTypeSelect = document.getElementById('entry-type');
const entryTypeNextButton = document.getElementById('entry-type-next');
const changePastPrompt = document.getElementById('change-past-prompt');
const changePastText = document.getElementById('change-past-text');
const pastTextNextButton = document.getElementById('past-text-next');
const changesResultsPrompt = document.getElementById('changes-results-prompt');
const changesResultsText = document.getElementById('changes-results-text');
const saveButton = document.getElementById('save-entry');
const entryList = document.getElementById('entry-date-list');

let audioCaptions;
let currentStep = 0;
let currentAudio = null;

const backgroundAudio = document.getElementById('background-music');
backgroundAudio.volume = 0.2;


document.addEventListener('DOMContentLoaded', function () {

    const stopAudioIcon = document.querySelector('.fa-volume-high');
    function stopBackgroundAudio() {
        backgroundAudio.muted = !backgroundAudio.muted;
        if (backgroundAudio.muted) {
            stopAudioIcon.classList.remove('fa-volume-high', 'fa-lg');
            stopAudioIcon.classList.add('fa-volume-xmark', 'fa-lg', 'mute');
            
        } else {
            stopAudioIcon.classList.remove('fa-volume-xmark', 'fa-lg', 'mute');
            stopAudioIcon.classList.add('fa-volume-high', 'fa-lg');
        }
    }
    
    stopAudioIcon.addEventListener('click', stopBackgroundAudio);
});

let userInput = {
    changePastText: '',
    changesResultsText: '',
};

startButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    entryTypePrompt.style.display = 'block';
    currentStep = 1;

    userInput = {
        changePastText: '',
        changesResultsText: '',
    };
});

entryTypeNextButton.addEventListener('click', () => {
    entryTypePrompt.style.display = 'none';
    changePastPrompt.style.display = 'block';
    currentStep = 2;
    changePastText.value = userInput.changePastText;
});

pastTextNextButton.addEventListener('click', () => {
    changePastPrompt.style.display = 'none';
    changesResultsPrompt.style.display = 'block';
    currentStep = 3;
    changesResultsText.value = userInput.changesResultsText;
});

function createEntryElement(type, text, changes, timestamp) {
        const li = document.createElement('li');
        const date = new Date(timestamp);
        const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
        li.innerHTML = `
            <strong>${type.toUpperCase()}:</strong> <br> 
            ${text}<br>
            <strong>CHANGES:</strong> <br>
            ${changes}<br>
            <strong>RECORDED:</strong> ${formattedDate}`;
        return li;
}

function saveEntryToLocalStorage(type, text, changes, timestamp) {
    const entry = {
        type, 
        text,
        changes,
        timestamp,
    };
    
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    entries.push(entry);
    
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
};

let entryDetailsVisible = false;

function displayEntriesFromLocalStorage() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    const dateList = document.getElementById('entry-date-list');
    dateList.innerHTML = '';

    entries.forEach((entry) => {
        const date = new Date(entry.timestamp);
        const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

        const listItem = document.createElement('li');
        listItem.textContent = formattedDate;
        listItem.addEventListener('click', () => displayEntryDetails(entry));

        dateList.appendChild(listItem);
    });
}

const entryDetailsContainer = document.getElementById('entry-details');
const recordsHeader = document.querySelector('records-header');
function hideRecordsHeader() {
    if (entryDetailsContainer.children.length >= 1) {
        recordsHeader.style.display = 'block';
    } else {
        recordsHeader.style.display = 'none';
    }
}

function displayEntryDetails(entry) {

    if (entryDetailsContainer.style.display === 'block') {
        entryDetailsContainer.style.display = 'none';
    } else {
        entryDetailsContainer.style.display = 'block';

        const formattedDate = new Date(entry.timestamp).toLocaleString();

        const entryDetailsDiv = document.createElement('div');

        entryDetailsDiv.style.backgroundColor = '#ffffff';
        entryDetailsDiv.style.padding = '10px';

        entryDetailsDiv.innerHTML = `
        <strong>${entry.type.toUpperCase()}:</strong> <br>
        ${entry.text}<br>
        <strong>CHANGES:</strong> <br>
        ${entry.changes}<br>
        <strong>RECORDED:</strong> ${formattedDate}
        `;

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = 'KEEP';
        minimizeButton.addEventListener('click', () => {
            entryDetailsContainer.style.display = 'none';

            const keepAudio = new Audio('media/for_real.mp3');
            keepAudio.volume = .4;
            const subtitlesElement = document.getElementById('subtitles');

            keepAudio.play();
            subtitlesElement.textContent = 'What the shit-- for real?!';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'YEET';
        deleteButton.addEventListener('click', () => deleteEntry(entry.timestamp));

        entryDetailsDiv.appendChild(minimizeButton);
        entryDetailsDiv.appendChild(deleteButton);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-evenly';
        buttonContainer.style.marginTop = '.5rem';

        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(minimizeButton);

        entryDetailsDiv.appendChild(buttonContainer);

        entryDetailsContainer.innerHTML = '';
        entryDetailsContainer.appendChild(entryDetailsDiv);
    }
}


function playDeleteAudio() {
    const deleteAudio = new Audio('media/git_out.mp3');
    deleteAudio.volume = .4;
    const subtitlesElement = document.getElementById('subtitles');
    
    deleteAudio.play();
    subtitlesElement.textContent = 'Go on and git out!';
}

function deleteEntry(timestamp) {
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    const entryToDelete = entries.find((entry) => entry.timestamp === timestamp);

    if (entryToDelete) {
        
        const confirmDelete = confirm('Ya ready to tell this regret to go on and git?!');
        
        if (confirmDelete) {

            playDeleteAudio();
            
            entries = entries.filter((entry) => entry.timestamp !== timestamp);
            
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            
            const entryDetailsContainer = document.getElementById('entry-details');
            entryDetailsContainer.style.display = 'none';
            entryDetailsContainer.innerHTML = '';
            
            displayEntriesFromLocalStorage();
        } 
    }
}

saveButton.addEventListener('click', () => {
    const type = entryTypeSelect.value;
    const text = changePastText.value.trim();
    const changes = changesResultsText.value.trim();

    if (currentStep === 2) {

        if (text = '') {
            alert('You need to put a little something at least');
            return;
        }
        userInput.changePastText = text;
    } else if (currentStep === 3) {
        if (changes === '') {
            alert('You need to put a little something at least');
            return;
        }
        userInput.changesResultsText = changes;
    }

    const timestamp = Date.now();
    saveEntryToLocalStorage(type, text, changes, timestamp);

    userInput.changePastText = text;
    userInput.changesResultsText = changes;

    displayEntriesFromLocalStorage();

    changePastText.value = '';
    changesResultsText.value = '';

    changePastPrompt.style.display = 'none';
    changesResultsPrompt.style.display = 'none';
    entryTypePrompt.style.display = 'none';
    welcomeScreen.style.display = 'block';
    currentStep = 0;
});

window.addEventListener('load', () => {
    displayEntriesFromLocalStorage();

    // if (localStorage.getItem('journalEntries')) {
    //     welcomeScreen.style.display = 'block';
    //     entryTypePrompt.style.display = 'none';
    // }
});

const previousButton = document.getElementById('previous-button');
const previousButtonFinal = document.getElementById('final-previous-button');
const nextButton = document.getElementById('next-button');

previousButton.addEventListener('click', () => {
    if (currentStep === 2) {
        changePastPrompt.style.display = 'none';
        entryTypePrompt.style.display = 'block';
        currentStep = 1;
    }
});

previousButtonFinal.addEventListener('click', () => {
    if (currentStep === 3) {
        changesResultsPrompt.style.display = 'none';
        changePastPrompt.style.display = 'block';
        currentStep = 2;
    }
})

nextButton.addEventListener('click', () => {
    if (currentStep === 2) {
        changePastPrompt.style.display = 'none';
        changesResultsPrompt.style.display = 'block';
        currentStep = 3;
    }
});


audioCaptions = {
    'entry-type-audio': "Well, was it something ya dun said or did?",
    'changes-results-audio': "Shit, I've been there",
    'change-past-audio': "So you how reckon you'd change things?",
    // 'damn_straight.mp3': "Damn straight!",
    'save': "Thanks for sharing, bub!",
    'for_real': "What the shit! For real?",
    // 'inquiry.mp3': "What's on your mind? Something from the past?",
    // 'makes_sense.mp3': "Nah, I get it. Makes complete sense.",
    // 'me_too.mp3': "Goddamn! Me too.",
    // 'memberin_time.mp3': "It's memberin' time.",
    // 'right_on.mp3': "Right on, you sumbitch.",
    // 'win.mp3': "Hell fucking yeah, I'll drink to that.",
    'little-bit': "It's all right to bitch a little bit."
}

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    audio.volume = .4;
    const subtitlesElement = document.getElementById('subtitles');

    if (currentAudio) {
        currentAudio.pause();
    }

    if (audio) {
        audio.play();

        if (audioCaptions[audioId]) {
            subtitlesElement.textContent = audioCaptions[audioId];
            console.log(`Subtitle: ${audioCaptions[audioId]}`);
        }
        currentAudio = audio;
    }
}

const fireElement = document.querySelector('.fire');

const parts = 50;

for (let i = 0; i < parts; i++) {
    const particleElement = document.createElement('div');
    particleElement.classList.add('particle');
    particleElement.style.animationDelay = `${1 * Math.random()}s`;
    particleElement.style.left = `calc((100% - 5em) * ${i / parts})`;
    fireElement.appendChild(particleElement);
}

entryTypeSelect.addEventListener('change', handleEntryType);

function handleEntryType() {
    const entryTypeSelect = document.getElementById('entry-type');
    const selectedOption = entryTypeSelect.value;

    if (selectedOption === 'Nothing') {
        const winAudio = new Audio('media/win.mp3');
        winAudio.volume = .4;
        const subtitlesElement = document.getElementById('subtitles');
        
        winAudio.play();
        subtitlesElement.textContent = "Hell fucking yeah! I'll drink to that.";
        
        currentStep = 0;
        welcomeScreen.style.display = 'block';
        entryTypePrompt.style.display = 'none';
        changePastPrompt.style.display = 'none';
        changesResultsPrompt.style.display = 'none';
    }
}