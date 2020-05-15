var btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
    var playerName = document.getElementsByName("player")[0].value;
    localStorage.setItem("player name", playerName);
    window.location.href = "game.html";
});