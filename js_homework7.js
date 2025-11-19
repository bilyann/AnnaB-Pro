"use strict";

// ДЗ 10.1. Параноя
var arr = [
    {
        userName: "Test",
        lastName: "Test",
        email: "test.test@gmail.com"
    },
    {
        userName: "Dmitro",
        lastName: "Porohov",
        email: "dmitro.porohov@yahoo.com"
    },
    {
        userName: "Andrii",
        lastName: "",
        email: "andrii@mail.ru" // Нам такі не підходять
    },
];

var trustedEmails = [];
var re = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@(gmail|yahoo)\.com$/;

for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i].email)) {
        trustedEmails.push(arr[i].email);
    }
}

console.log("Довірені email:", trustedEmails);
/*
вирішуємо за допомогою регулярного виразу умову, коли одне або два слова перед @, латинські літери і цифри, розділені крапкою
і тільки домени gmail.com або yahoo.com
*/
//--------------------------------------------------
console.log("----------");

// ДЗ 10.2. Без А
var words = ["Wonderful", "Joyful", "Happiness", "Time", "Task", "Apple"];
var re2 = /^[^aA]{6,}$/;
var result = [];

for (var i = 0; i < words.length; i++) {
    if (re2.test(words[i])) {
        result.push(words[i]);
    }
}

console.log("Слова без літери A:", result);
/*
перевіряємо щоб було 6 або більше символів і не містило а чи А
*/