class State {
    constructor(sessionLength, breakLength) {
        this.timer = null;
        this.timerState = false; // false = off / true = on
        this.sessionLength = sessionLength;
        this.breakLength = breakLength;
        this.maxLength = 60;
        this.timeLeft = (sessionLength < 10) ? `0${sessionLength}:00` : `${sessionLength}:00`;
        this.breakTimer = false; // false = breakTimer not running / true = breakTimer running

        this.resetDefaults = () => {
            this.sessionLength = sessionLength;
            this.breakLength = breakLength;
            this.timeLeft = (sessionLength < 10) ? `0${sessionLength}:00` : `${sessionLength}:00`;
            $(".fa-pause").hide();
            $(".fa-play").show();
            $("#time-left").css("color", "#FFF");
        }

        this.resetTimeLeft = () => {
            this.timeLeft = (this.sessionLength < 10) ? `0${this.sessionLength}:00` : `${this.sessionLength}:00`;
            $(".fa-pause").hide();
            $(".fa-play").show();
            $("#time-left").css("color", "#FFF");
        }

        // render default settings
        $("#time-left").text(this.timeLeft);
        $("#session-length").text(this.sessionLength);
        $("#break-length").text(this.breakLength);
        $(".fa-pause").hide();
    }
};

// initialize state object
state = new State(25, 5);

// session length time control
$("#session-increment").click(() => {
    if ((state.sessionLength < state.maxLength) && !state.timerState) {
        state.sessionLength++;
        state.timeLeft = (state.sessionLength < 10) ? `0${state.sessionLength}:00` : `${state.sessionLength}:00`;
        $("#time-left").text(state.timeLeft);
        $("#session-length").text(state.sessionLength);
    }
});

$("#session-decrement").click(() => {
    if ((state.sessionLength > 1) && !state.timerState) {
        state.sessionLength--;
        state.timeLeft = (state.sessionLength < 10) ? `0${state.sessionLength}:00` : `${state.sessionLength}:00`;
        $("#time-left").text(state.timeLeft);
        $("#session-length").text(state.sessionLength);
    }
});

// break length time control
$("#break-increment").click(() => {
    if ((state.breakLength < state.maxLength) && !state.timerState) {
        state.breakLength++;
        $("#break-length").text(state.breakLength);
    }
});

$("#break-decrement").click(() => {
    if ((state.breakLength > 1) && !state.timerState) {
        state.breakLength--;
        $("#break-length").text(state.breakLength);
    }
});

// reset default state
$("#reset").click(() => {
    state.resetDefaults();
    $("#time-left").text(state.timeLeft);
    $("#session-length").text(state.sessionLength);
    $("#break-length").text(state.breakLength);
    $("#timer-label").text("Session");

    // stop timer
    clearInterval(state.timer);
    state.timerState = false;
});

// stop timer
$("#stop").click(() => {
    state.resetTimeLeft();
    $("#time-left").text(state.timeLeft);
    $("#timer-label").text("Session");

    // stop timer
    clearInterval(state.timer);
    state.timerState = false;
});

/**
 * converts time from seconds to mm:ss
 * @param time in seconds
 */
function convertTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

/**
 * converts time from mm:ss to seconds
 * @param time in mm:ss format
 */
function convertTimerToSeconds(time) {
    let minutes = Number(time.slice(0, 2));
    let seconds = Number(time.slice(3));
    return minutes * 60 + seconds;
}

// 
function startTimer() {
    if (!state.timerState) {
        // timer is off: start timer
        $(".fa-play").hide();
        $(".fa-pause").show();
        let time = convertTimerToSeconds(state.timeLeft); // time in seconds

        let timerSound = new Audio("sounds/timer.wav");
        state.timer = setInterval(() => {
            --time;
            state.timeLeft = convertTime(time);
            $("#time-left").text(state.timeLeft);

            if (time < 60) {
                // change color when one minute remains
                $("#time-left").css("color", "red");
                timerSound.play();
            }

            if (time < 1) {
                // stop timer and run the other timer (session or break)
                clearInterval(state.timer);
                if (state.breakTimer) {
                    state.timeLeft = (state.sessionLength < 10) ? `0${state.sessionLength}:00` : `${state.sessionLength}:00`;
                    $("#timer-label").text("Session");
                    $("#time-left").css("color", "#FFF");
                } else {
                    state.timeLeft = (state.breakLength < 10) ? `0${state.breakLength}:00` : `${state.breakLength}:00`;
                    $("#timer-label").text("Break");
                    $("#time-left").css("color", "#FFF");
                }

                state.breakTimer = !state.breakTimer;
                state.timerState = false;
                startTimer();
            }
        }, 1000);
    } else {
        // timer is on: pause timer
        $(".fa-pause").hide();
        $(".fa-play").show();
        clearInterval(state.timer);
    }

    state.timerState = !state.timerState;
}

// start/pause timer
$("#start-pause").click(startTimer);