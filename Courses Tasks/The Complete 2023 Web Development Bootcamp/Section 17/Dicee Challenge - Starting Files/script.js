let randomValue1 = Math.ceil(Math.random() * 6);
let randomValue2 = Math.ceil(Math.random() * 6);
console.log(randomValue1);
document
  .querySelector(".img1")
  .setAttribute("src", `./images/dice${randomValue1}.png`);
document
  .querySelector(".img2")
  .setAttribute("src", `./images/dice${randomValue2}.png`);
const winner =
  randomValue1 > randomValue2
    ? "Player 1 Wins"
    : randomValue1 == randomValue2
    ? "Draw"
    : "Player 2 Wins";
document.querySelector(".container h1").innerHTML = winner;
