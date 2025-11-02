//"use strict"
const prompt = require('prompt-sync')({sigint: true}); // довелося шукати помилку, не спрацьовувала функція, інтернети підсказали

function pow(x, y) {
    let result = 1;
    for (let i = 0; i < y; i++) {
        result = result * x;
    }
    return result;
}
console.log("Приводимо число Y у ступінь X і показуємо результати обчислень")
let x = Number(prompt("Введіть число у: "));
let y = Number(prompt("Введіть число x: "));

console.log("Результат: " + pow(x, y));