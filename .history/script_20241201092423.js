
let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let audio; // For playing music

document.addEventListener("DOMContentLoaded", function () {
    const text = "AGE";
    const typewriter = document.getElementById("typewriter-text");

    let index = 0;
    function typeEffect() {
        if (index < text.length) {
            typewriter.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeEffect, 200);
        } else {
            setTimeout(() => {
                typewriter.innerHTML = "";
                index = 0;
                typeEffect();
            }, 1500);
        }
    }

    typeEffect();
});

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-us";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Dear");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Dear");
    } else {
        speak("Good Evening Dear");
    }
}

// Weather API endpoint
const weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
const weatherApiKey = '66135fb5258854e5e3b842c66d9e7732';

function getWeather(city) {
    const url = `${weatherApi}?q=${city}&units=metric&appid=${weatherApiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weather = data.weather[0];
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                speak(`The weather in ${city} is ${weather.description} with a temperature of ${temperature} degrees Celsius and humidity of ${humidity}%.`);
            } else {
                speak(`Sorry, I couldn't fetch the weather for ${city}.`);
            }
        })
        .catch(error => speak(`Error fetching weather data for ${city}`));
}

// Joke API
function tellJoke() {
    fetch('https://icanhazdadjoke.com/', {
        headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(data => speak(data.joke))
    .catch(error => speak("Sorry, I couldn't fetch a joke at the moment."));
}

async function fetchGPTReply(mess) {
    const apiKey = 'AIzaSyD99QHpAYqD3-aiY3t3r6m2wmAwy23PnXs'; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: `Please provide a brief response: ${mess}`
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        // Extract the reply from the response
        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content;
            // Return the text of the first part of the reply for brevity
            return reply.parts[0].text; 
        } else {
            throw new Error('No candidates found in the response.');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error for further handling if needed
    }
}



let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

async function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey") || message.includes("Hello , asadullah") || message.includes("hey , asadullah")) {
        wishMe();
        speak("What can I help you with?");
    } 
    else if (message.includes("assalam-o-alaikum") || message.includes("assalam walekum")) {
        speak("Walaikum Assalam dear, how can I help you?");
    } 
    else if (message.includes("how are you")) {
        speak("Hello dear, I am good.");
    } 
    else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Sir Asadullah Shafique.");
    } 
    else if (message.includes("open linkedin")) {
        speak("Opening LinkedIn...");
        window.open("https://www.linkedin.com/");
    } 
    else if (message.includes("open chatgpt")) {
        speak("Opening ChatGPT...");
        window.open("https://chatgpt.com/");
    } 
    else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } 
    else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } 
    else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } 
    else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    }  
    else if(message.includes("open whatsapp")){
        speak("Opening WhatsApp..")
        window.open("whatsapp://");
    }
    else if(message.includes("open calculator")){
        speak("Opening calculator..");
        window.open("calculator://");
    }
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } 
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Today is ${date}`);
    } 
    else if (message.includes("tell me any joke")) {
        tellJoke();
    } 
    else if (message.includes("weather of")) {
        let words = message.split(" ");
        const city = words[words.length - 1];  // Extract city name
        getWeather(city);
    } 
    else if (message.includes("play music")) {
        if (!audio) {
            audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
            audio.play();
            speak("Playing music now.");
        } else {
            speak("Music is already playing.");
        }
    } 
    else if (message.includes("pause music")) {
        if (audio && !audio.paused) {
            audio.pause();
            speak("Music paused.");
        } else {
            speak("No music is playing right now.");
        }
    } 
    else if (message.includes("stop music")) {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            speak("Music stopped.");
            audio = null;
        } else {
            speak("No music is playing right now.");
        }
    } else if(message.includes("leave it")){
        speak("Okay, I am leaving now. Have a great day ahead");
    }
    // Fallback to OpenAI GPT if no command matches
    else {
        const gptReply = await fetchGPTReply(message).then(reply => reply).catch(error => error.message);
        console.log(gptReply)
        speak(gptReply);
    }
}

