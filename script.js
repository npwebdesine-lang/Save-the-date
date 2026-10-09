(function () {
  // Wedding: Thursday 17.12.2026, 19:30 Israel time (IST = UTC+2 in December)
  var START = new Date("2026-12-17T19:30:00+02:00");
  var END = new Date("2026-12-18T00:30:00+02:00");

  var EVENT = {
    title: "החתונה של נתיב ואוראל 💍",
    details:
      "שמרו את התאריך! הזמנה רשמית ופרטי המקום יישלחו בהמשך.\nhttps://npwebdesine-lang.github.io/Save-the-date/",
    location: "ישראל (פרטים יישלחו בהמשך)",
  };

  // 20261217T173000Z
  function toUTCStamp(d) {
    return d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  // ---- Google Calendar link ----
  var gcal =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent(EVENT.title) +
    "&dates=" +
    toUTCStamp(START) +
    "/" +
    toUTCStamp(END) +
    "&details=" +
    encodeURIComponent(EVENT.details) +
    "&location=" +
    encodeURIComponent(EVENT.location) +
    "&ctz=Asia/Jerusalem";
  document.getElementById("gcalLink").href = gcal;

  // ---- .ics download ----
  function escapeICS(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  function buildICS() {
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nativ & Orel//Save the Date//HE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:nativ-orel-wedding-20261217@save-the-date",
      "DTSTAMP:" + toUTCStamp(new Date()),
      "DTSTART:" + toUTCStamp(START),
      "DTEND:" + toUTCStamp(END),
      "SUMMARY:" + escapeICS(EVENT.title),
      "DESCRIPTION:" + escapeICS(EVENT.details),
      "LOCATION:" + escapeICS(EVENT.location),
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + escapeICS("עוד שבוע החתונה של נתיב ואוראל!"),
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }

  document.getElementById("icsBtn").addEventListener("click", function () {
    var blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "nativ-orel-wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
    closeMenu();
  });

  // ---- Dropdown menu ----
  var btn = document.getElementById("calBtn");
  var menu = document.getElementById("calMenu");

  function openMenu() {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.hidden ? openMenu() : closeMenu();
  });
  document.getElementById("gcalLink").addEventListener("click", closeMenu);
  document.addEventListener("click", function (e) {
    if (!menu.hidden && !menu.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
      btn.focus();
    }
  });

  // ---- Countdown ----
  var els = {};
  document.querySelectorAll("#countdown [data-unit]").forEach(function (el) {
    els[el.dataset.unit] = el;
  });

  function tick() {
    var diff = Math.max(0, START - Date.now());
    var s = Math.floor(diff / 1000);
    els.days.textContent = Math.floor(s / 86400);
    els.hours.textContent = String(Math.floor(s / 3600) % 24).padStart(2, "0");
    els.minutes.textContent = String(Math.floor(s / 60) % 60).padStart(2, "0");
    els.seconds.textContent = String(s % 60).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
})();
