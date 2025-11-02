//"use strict"
const prompt = require('prompt-sync')({sigint: true}); // довелося шукати помилку, не спрацьовувала функція, інтернети підсказали

function pow(x, y) {
    let result = 1;
    for (let i = 0; i < y; i++) {
        result = result * x;
    }
    return result;
}
console.log("Приводимо число X у ступінь Y і показуємо результати обчислень")
let x = Number(prompt("Введіть число X: "));
let y = Number(prompt("Введіть число Y: "));

console.log("Результат: " + pow(x, y));