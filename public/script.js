// ===============================
// ELEMENTS
// ===============================

const generateBtn =
    document.getElementById("generateBtn");

const mission =
    document.getElementById("mission");

const missionContent =
    document.getElementById("missionContent");

const activeMissionTitle =
    document.getElementById(
        "activeMissionTitle"
    );

const activeMissionDescription =
    document.getElementById(
        "activeMissionDescription"
    );

const startBtn =
    document.getElementById("startBtn");

const grassMode =
    document.getElementById("grassMode");

const completeBtn =
    document.getElementById("completeBtn");

const timer =
    document.getElementById("timer");

const missionCount =
    document.getElementById("missionCount");

const xp =
    document.getElementById("xp");

const streak =
    document.getElementById("streak");

const historyList =
    document.getElementById("historyList");


// ===============================
// SAVED DATA
// ===============================

let completedMissions =
    Number(
        localStorage.getItem(
            "completedMissions"
        )
    ) || 0;

let grassXP =
    Number(
        localStorage.getItem(
            "grassXP"
        )
    ) || 0;

let missionHistory =
    JSON.parse(
        localStorage.getItem(
            "missionHistory"
        )
    ) || [];


// ===============================
// DAILY STREAK DATA
// ===============================

let currentStreak =
    Number(
        localStorage.getItem(
            "currentStreak"
        )
    ) || 0;

let lastCompletedDate =
    localStorage.getItem(
        "lastCompletedDate"
    );


// ===============================
// TIMER
// ===============================

let seconds = 0;

let timerInterval;


// ===============================
// CURRENT AI MISSION
// ===============================

let currentMission = null;


// ===============================
// INITIAL DISPLAY
// ===============================

missionCount.textContent =
    completedMissions;

xp.textContent =
    grassXP;

streak.textContent =
    currentStreak;


// ===============================
// GENERATE AI MISSION
// ===============================

generateBtn.addEventListener(
    "click",
    async function () {

        // =========================
        // SHOW LOADING STATE
        // =========================

        generateBtn.disabled = true;

        generateBtn.innerHTML = `
            🤖 Creating Mission...
        `;


        // =========================
        // GET USER INPUT
        // =========================

        const time =
            document.getElementById(
                "time"
            ).value;

        const activity =
            document.getElementById(
                "activity"
            ).value;

        const energy =
            document.getElementById(
                "energy"
            ).value;

        const mood =
            document.getElementById(
                "mood"
            ).value;

        const company =
            document.getElementById(
                "company"
            ).value;


        // =========================
        // SHOW MISSION CARD
        // =========================

        mission.classList.remove(
            "hidden"
        );


        // =========================
        // LOADING MESSAGE
        // =========================

        missionContent.innerHTML = `

            <p>
                🤖 Creating your personalized mission...
            </p>

        `;


        // =========================
        // SEND DATA TO BACKEND
        // =========================

        try {

            const response =
                await fetch(
                    "/api/generate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            time: time,

                            activity: activity,

                            energy: energy,

                            mood: mood,

                            company: company

                        })
                    }
                );


            const data =
                await response.json();


            // =========================
            // BACKEND ERROR
            // =========================

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "AI request failed"
                );

            }


            // =========================
            // INVALID AI RESPONSE
            // =========================

            if (
                !data.title ||
                !data.description
            ) {

                throw new Error(
                    "AI returned an invalid mission"
                );

            }


            // =========================
            // SAVE CURRENT MISSION
            // =========================

            currentMission = data;


            // =========================
            // RESET BUTTON AFTER SUCCESS
            // =========================

            generateBtn.disabled = false;

            generateBtn.innerHTML = `
                🌱 Generate My Mission
                <span>→</span>
            `;


            // =========================
            // DISPLAY MISSION
            // =========================

            missionContent.innerHTML = `

                <h3>
                    🌿 ${data.title}
                </h3>

                <p>
                    ${data.description}
                </p>

                <br>

                <p>
                    ⏱️
                    <strong>Time:</strong>
                    ${data.time}
                </p>

                <p>
                    🌱
                    <strong>Difficulty:</strong>
                    ${data.difficulty}
                </p>

                <div class="mission-warning">
                    📵 ${data.phoneRule}
                </div>

            `;

        }


        catch (error) {

            // =========================
            // LOG ERROR
            // =========================

            console.error(
                "AI ERROR:",
                error
            );


            // =========================
            // RESET BUTTON AFTER ERROR
            // =========================

            generateBtn.disabled = false;

            generateBtn.innerHTML = `
                🌱 Generate My Mission
                <span>→</span>
            `;


            // =========================
            // SHOW ERROR MESSAGE
            // =========================

            missionContent.innerHTML = `

                <p>
                    ❌ Couldn't generate the mission.
                </p>

                <p>
                    ${error.message}
                </p>

                <p>
                    Make sure Ollama and the
                    Node server are running.
                </p>

            `;

        }

    }
);


// ===============================
// START COUNTDOWN TIMER
// ===============================

function startTimer() {

    // Get selected mission time

    const selectedTime =
        document.getElementById(
            "time"
        ).value;


    // =========================
    // CONVERT TIME TO SECONDS
    // =========================

    if (
        selectedTime ===
        "15 minutes"
    ) {

        seconds =
            15 * 60;

    }

    else if (
        selectedTime ===
        "30 minutes"
    ) {

        seconds =
            30 * 60;

    }

    else if (
        selectedTime ===
        "1 hour"
    ) {

        seconds =
            60 * 60;

    }

    else if (
        selectedTime ===
        "2 hours"
    ) {

        seconds =
            2 * 60 * 60;

    }

    else {

        seconds =
            15 * 60;

    }


    // =========================
    // STOP PREVIOUS TIMER
    // =========================

    clearInterval(
        timerInterval
    );


    // =========================
    // SHOW INITIAL TIME
    // =========================

    updateTimerDisplay();


    // =========================
    // START COUNTDOWN
    // =========================

    timerInterval =
        setInterval(
            function () {

                seconds--;


                // =================
                // TIME FINISHED
                // =================

                if (
                    seconds <= 0
                ) {

                    seconds = 0;

                    updateTimerDisplay();

                    clearInterval(
                        timerInterval
                    );

                    alert(
                        "🌿 Mission time is complete!\n\nYou can come back and complete your mission."
                    );

                    return;

                }


                updateTimerDisplay();

            },

            1000

        );

}


// ===============================
// UPDATE TIMER DISPLAY
// ===============================

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        seconds % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

}


// ===============================
// START MISSION
// ===============================

startBtn.addEventListener(
    "click",
    function () {

        // Hide AI mission card

        mission.classList.add(
            "hidden"
        );


        // Show Touch Grass Mode

        grassMode.classList.remove(
            "hidden"
        );


        // =========================
        // SHOW ACTIVE AI MISSION
        // =========================

        if (currentMission) {

            activeMissionTitle.textContent =
                currentMission.title;

            activeMissionDescription.textContent =
                currentMission.description;

        }


        // =========================
        // START TIMER
        // =========================

        startTimer();

    }
);


// ===============================
// UPDATE DAILY STREAK
// ===============================

function updateStreak() {

    const today =
        new Date().toDateString();


    // =========================
    // FIRST COMPLETED MISSION
    // =========================

    if (!lastCompletedDate) {

        currentStreak = 1;

    }


    else {

        const lastDate =
            new Date(
                lastCompletedDate
            );

        const todayDate =
            new Date(today);


        const difference =
            todayDate.getTime() -
            lastDate.getTime();


        const oneDay =
            1000 *
            60 *
            60 *
            24;


        // =========================
        // COMPLETED NEXT DAY
        // =========================

        if (
            difference >= oneDay &&
            difference < oneDay * 2
        ) {

            currentStreak++;

        }


        // =========================
        // SAME DAY
        // =========================

        else if (
            difference === 0
        ) {

            // Streak stays the same.

        }


        // =========================
        // MISSED DAYS
        // =========================

        else if (
            difference >= oneDay * 2
        ) {

            currentStreak = 1;

        }

    }


    // =========================
    // SAVE STREAK
    // =========================

    localStorage.setItem(
        "currentStreak",
        currentStreak
    );

    localStorage.setItem(
        "lastCompletedDate",
        today
    );


    // =========================
    // UPDATE SCREEN
    // =========================

    streak.textContent =
        currentStreak;

}


// ===============================
// DISPLAY MISSION HISTORY
// ===============================

function displayMissionHistory() {

    // Make sure history section exists

    if (!historyList) {

        return;

    }


    // =========================
    // NO MISSIONS YET
    // =========================

    if (
        missionHistory.length === 0
    ) {

        historyList.innerHTML = `

            <p class="empty-history">
                🌱 No missions completed yet.
            </p>

        `;

        return;

    }


    // =========================
    // CLEAR OLD HISTORY
    // =========================

    historyList.innerHTML = "";


    // =========================
    // SHOW NEWEST FIRST
    // =========================

    missionHistory
        .slice()
        .reverse()
        .forEach(
            function (missionData) {

                const historyItem =
                    document.createElement(
                        "div"
                    );


                historyItem.classList.add(
                    "history-item"
                );


                historyItem.innerHTML = `

                    <div class="history-content">

                        <h3>
                            🌿 ${missionData.title}
                        </h3>

                        <p>
                            ${missionData.description}
                        </p>

                        <span class="history-xp">
                            +50 Grass XP
                        </span>

                    </div>


                    <div class="history-meta">

                        <div>
                            ⏱️ ${missionData.time}
                        </div>

                        <div>
                            🌳 ${missionData.activity}
                        </div>

                        <div>
                            ⚡ ${missionData.energy || "Medium"}
                        </div>

                        <div>
                            🧠 ${missionData.mood || "Happy"}
                        </div>

                        <div>
                            👥 ${missionData.company || "Alone"}
                        </div>

                        <div>
                            📅 ${missionData.date}
                        </div>

                    </div>

                `;


                historyList.appendChild(
                    historyItem
                );

            }
        );

}


// ===============================
// COMPLETE MISSION
// ===============================

completeBtn.addEventListener(
    "click",
    function () {

        // =========================
        // STOP TIMER
        // =========================

        clearInterval(
            timerInterval
        );


        // =========================
        // INCREASE MISSIONS
        // =========================

        completedMissions++;


        // =========================
        // INCREASE XP
        // =========================

        grassXP += 50;


        // =========================
        // UPDATE STREAK
        // =========================

        updateStreak();


        // =========================
        // SAVE MISSIONS
        // =========================

        localStorage.setItem(
            "completedMissions",
            completedMissions
        );


        // =========================
        // SAVE XP
        // =========================

        localStorage.setItem(
            "grassXP",
            grassXP
        );


        // =========================
        // SAVE COMPLETED MISSION
        // =========================

        const completedMission = {

            title:
                currentMission
                    ? currentMission.title
                    : "Outdoor Mission",

            description:
                currentMission
                    ? currentMission.description
                    : "",

            activity:
                document.getElementById(
                    "activity"
                ).value,

            energy:
                document.getElementById(
                    "energy"
                ).value,

            mood:
                document.getElementById(
                    "mood"
                ).value,

            company:
                document.getElementById(
                    "company"
                ).value,

            time:
                currentMission
                    ? currentMission.time
                    : document.getElementById(
                        "time"
                    ).value,

            date:
                new Date()
                    .toLocaleDateString()

        };


        // =========================
        // ADD TO HISTORY
        // =========================

        missionHistory.push(
            completedMission
        );


        // =========================
        // SAVE HISTORY
        // =========================

        localStorage.setItem(
            "missionHistory",
            JSON.stringify(
                missionHistory
            )
        );


        // =========================
        // UPDATE HISTORY UI
        // =========================

        displayMissionHistory();


        // =========================
        // UPDATE SCREEN
        // =========================

        missionCount.textContent =
            completedMissions;

        xp.textContent =
            grassXP;

        streak.textContent =
            currentStreak;


        // =========================
        // HIDE TOUCH GRASS MODE
        // =========================

        grassMode.classList.add(
            "hidden"
        );


        // =========================
        // RESET TIMER
        // =========================

        timer.textContent =
            "00:00";


        // =========================
        // SUCCESS MESSAGE
        // =========================

        alert(
            `🌿 Mission Complete!

+50 Grass XP

🔥 Streak:
${currentStreak} day${currentStreak === 1 ? "" : "s"}`
        );

    }
);


// ===============================
// INITIALIZE MISSION HISTORY
// ===============================

// Load saved history when page opens

displayMissionHistory();