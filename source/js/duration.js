!(() => {
  const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
  const start = new Date("2018/03/14 10:55:00");

  const update = () => {
    let now = new Date();
    now.setTime(now.getTime()+250);
    days = Math.ceil((now - start) / MILLISECONDS_IN_DAY);
    document.getElementById("timeDate").innerHTML = `Site alive for ${days} days`;
  }

  update();
  setInterval(update, MILLISECONDS_IN_DAY);
})();