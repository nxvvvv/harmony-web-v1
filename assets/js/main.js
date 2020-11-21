// MOVEMENT

$('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
        if (
            location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')
            &&
            location.hostname === this.hostname
        ) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function () {
                    let $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) {
                        return false;
                    } else {
                        $target.attr('tabindex', '-1');
                        $target.focus();
                    }
                });
            }
        }
    });

// MOBILE

let show = true;

function menu() {
    if (show === true) {
        document.getElementById("mobile-nav").style.display = "flex";
        document.getElementById("body").style.overflow = "hidden";
        document.getElementById('navbar-toggle').classList.add('navbar-toggle-active');
        document.getElementById('top-bar').classList.add('top-bar-active');
        document.getElementById('middle-bar').classList.add('middle-bar-active');
        document.getElementById('bottom-bar').classList.add('bottom-bar-active');
        show = false;
    } else {
        document.getElementById("mobile-nav").style.display = "none";
        document.getElementById("body").style.overflow = "initial";
        document.getElementById('navbar-toggle').classList.remove('navbar-toggle-active');
        document.getElementById('top-bar').classList.remove('top-bar-active');
        document.getElementById('middle-bar').classList.remove('middle-bar-active');
        document.getElementById('bottom-bar').classList.remove('bottom-bar-active');
        show = true;
    }
}

// WEBSOCKET

let websocket;
let websocketUrl = `wss://stats-socket.groovybot.space:6015`;

connectToWebsocket();
function connectToWebsocket() {

    websocket = new WebSocket(websocketUrl);
    websocket.onopen = function () {
        console.info("[Websocket] Successfully connected to server!");
        websocket.send(parseMessage("web", "getstats", ''));
    };

    websocket.onclose = function () {
        console.warn(`[Websocket] Got disconnected from websocket trying to reconnect in 5 seconds`);
        setTimeout(() => reconnect(), 5000);
    };

    websocket.onerror = function (error) {
        console.error("[Websocket] An error occurred: " + error.eventPhase);
    };

    websocket.onmessage = function (message) {
        let object = JSON.parse(message.data);

        if (object.type == null || object.data == null) return;

        if (object.type === "error") {
            console.error("[Websocket] Error! " + object.data.text)
        }

        if (object.type === "poststats") {
            updateStats(object.data.playing, object.data.guilds, object.data.users);
            console.info("[Websocket] Received stats!");
        }
    };
}


function reconnect() {
    console.info("[Websocket] Trying to reconnect ...");
    connectToWebsocket();
}



function parseMessage(client, type, data) {
    return JSON.stringify(
        {
            "client": client,
            "type": type,
            "data": data
        }
    );
}

// STATS

function updateStats(playing, servers, users) {
    let comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
    $('.playing').animateNumber({
        number: playing,
        numberStep: comma_separator_number_step
    }, 1500);
    $('.servers').animateNumber({
        number: servers,
        numberStep: comma_separator_number_step
    }, 1500);
    $('.users').animateNumber({
        number: users,
        numberStep: comma_separator_number_step
    }, 1500);
}
