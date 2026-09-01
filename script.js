// ========================================
// CUENTA REGRESIVA
// ========================================

const countdownScreen =
    document.getElementById("countdownScreen");

const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");


// ========================================
// FECHA DE APERTURA
// ========================================

// Colombia = UTC -05:00

const openingDate =
    new Date(
        "2026-09-01T18:00:00-05:00"
    );


// ========================================
// ACTUALIZAR TEMPORIZADOR
// ========================================

function updateCountdown() {

    const now =
        new Date();

    const difference =
        openingDate.getTime()
        - now.getTime();


    // ====================================
    // YA LLEGÓ LA HORA
    // ====================================

    if (difference <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";


        countdownScreen.classList.add(
            "hidden"
        );


        // Detener temporizador

        clearInterval(countdownInterval);


        return;

    }


    // ====================================
    // CÁLCULOS
    // ====================================

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference %
                (1000 * 60 * 60 * 24))
            /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (difference %
                (1000 * 60 * 60))
            /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (difference %
                (1000 * 60))
            /
            1000
        );


    // ====================================
    // MOSTRAR
    // ====================================

    daysElement.textContent =
        String(days).padStart(2, "0");

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");

}


// ========================================
// INICIAR
// ========================================

updateCountdown();


const countdownInterval =
    setInterval(
        updateCountdown,
        1000
    );

// ========================================
// ELEMENTOS
// ========================================

const video =
    document.getElementById("invitationVideo");

const decisionSection =
    document.getElementById("decisionSection");

const acceptButtonOne =
    document.getElementById("acceptButtonOne");

const acceptButtonTwo =
    document.getElementById("acceptButtonTwo");

const acceptedOverlay =
    document.getElementById("acceptedOverlay");


// ========================================
// CONFIGURACIÓN DE LA CITA
// CAMBIA ESTO POR TUS DATOS
// ========================================

const eventData = {

    title:
        "Una cita contigo ❤️",

    description:
        "Una pequeña cita que he preparado especialmente para nosotros.",

    location:
        "Nuestro lugar especial",

    // IMPORTANTE:
    // formato: AAAA-MM-DDTHH:MM:SS

    start:
        "2026-09-12T18:00:00",

    end:
        "2026-09-12T21:00:00"
};


// ========================================
// MOSTRAR BOTONES
// ========================================

// Los botones aparecen cuando termina el video.

video.addEventListener("ended", () => {

    decisionSection.classList.add("visible");

    setTimeout(() => {

        decisionSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 500);

});


// Si quieres que aparezcan también cuando
// el video esté prácticamente terminado:

video.addEventListener("timeupdate", () => {

    if (!video.duration) return;

    const percentage =
        video.currentTime / video.duration;

    if (percentage >= 0.97) {

        decisionSection.classList.add("visible");

    }

});


// ========================================
// BOTONES ACEPTAR
// ========================================

acceptButtonOne.addEventListener(
    "click",
    acceptInvitation
);

acceptButtonTwo.addEventListener(
    "click",
    acceptInvitation
);


// ========================================
// ACEPTAR INVITACIÓN
// ========================================

function acceptInvitation() {

    acceptedOverlay.classList.add("visible");

    createCalendarEvent();

}


// ========================================
// CREAR EVENTO DE CALENDARIO
// ========================================

function createCalendarEvent() {

    const start =
        formatICSDate(
            new Date(eventData.start)
        );

    const end =
        formatICSDate(
            new Date(eventData.end)
        );


    const calendarContent = [

        "BEGIN:VCALENDAR",

        "VERSION:2.0",

        "PRODID:-//Nuestra Invitacion//ES",

        "CALSCALE:GREGORIAN",

        "BEGIN:VEVENT",

        `DTSTART:${start}`,

        `DTEND:${end}`,

        `SUMMARY:${escapeICS(eventData.title)}`,

        `DESCRIPTION:${escapeICS(eventData.description)}`,

        `LOCATION:${escapeICS(eventData.location)}`,

        `UID:${Date.now()}@nuestra-invitacion`,

        "STATUS:CONFIRMED",

        "END:VEVENT",

        "END:VCALENDAR"

    ].join("\r\n");


    const blob =
        new Blob(
            [calendarContent],
            {
                type:
                    "text/calendar;charset=utf-8"
            }
        );


    const calendarURL =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        calendarURL;

    link.download =
        "nuestra-cita.ics";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    setTimeout(() => {

        URL.revokeObjectURL(
            calendarURL
        );

    }, 1000);

}


// ========================================
// FORMATO DE FECHA ICS
// ========================================

function formatICSDate(date) {

    return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

}


// ========================================
// ESCAPAR TEXTO PARA ICS
// ========================================

function escapeICS(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");

}
