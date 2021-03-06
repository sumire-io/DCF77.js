let Clock = (function() {
  let second, minute, hour;
  let s = Snap("#clockDiv");

  function initialize() {
    // Insert correct UTC info
    Array.from(document.getElementsByClassName("correctTimezone")).map(
      el => (el.innerText = isDST(new Date()) ? "UTC+2" : "UTC+1")
    );
    
    Snap.load("resources/clock.svg", function(f) {
      second = f.select("#second_hand");
      minute = f.select("#minute_hand");
      hour = f.select("#hour_hand");
      s.append(f);
    });
    setTimeout(refresh, 1000 - new Date().getMilliseconds());
  }

  function animateTime() {
    let timeNow = getDETime();
    let hours = timeNow.getHours();
    let minutes = timeNow.getMinutes();
    let seconds = timeNow.getSeconds();
    second.transform(`r${seconds * 6 - 2},190,190`);
    second.animate(
      { transform: `r${seconds * 6 * 0.9999},190,190` },
      300,
      mina.elastic
    );
    minute.transform(`r${minutes * 6},190,190`);
    if (seconds === 0) {
      minute.transform(`r${minutes * 6 - 2},190,190`);
      minute.animate(
        { transform: `r${minutes * 6 * 0.9999},190,190` },
        300,
        mina.elastic
      );
    }
    hour.transform(`r${hours * 30 + minutes / 2},190,190`);
  }

  function getDETime() {
    let currentTime = new Date();
    return new Date(
      currentTime.getUTCFullYear(),
      currentTime.getUTCMonth(),
      currentTime.getUTCDate(),
      isDST(currentTime)
        ? currentTime.getUTCHours() + 2
        : currentTime.getUTCHours() + 1,
      currentTime.getUTCMinutes(),
      currentTime.getUTCSeconds()
    );
  }

  function updateTextClock() {
    let timeNow = getDETime();
    let hours = timeNow.getHours();
    let minutes = timeNow.getMinutes();
    let seconds = timeNow.getSeconds();
    document.getElementById("time").innerText = `${hours}:${(
      "00" + minutes
    ).slice(-2)}:${("00" + seconds).slice(-2)}`;
  }

  function isDST(t) {
    const jan = new Date(t.getFullYear(), 0, 1);
    const jul = new Date(t.getFullYear(), 6, 1);
    return (
      Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) ===
      t.getTimezoneOffset()
    );
  }

  function refresh() {
    animateTime();
    updateTextClock();
    setTimeout(refresh, 1000 - new Date().getMilliseconds());
  }

  return {
    start: function() {
      initialize();
    }
  };
})();
