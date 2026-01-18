"use strict";

var services = {
    "стрижка": "60 грн",
    "гоління": "80 грн",
    "Миття голови": "100 грн",

    price: function() {
        var total = 0;
        for (var key in this) {
            
            if (typeof this[key] === "string" && this[key].includes("грн")) {
                total += parseFloat(this[key]);
            }
        }
        return total + " грн";
    },

    // Метод для пошуку мінімальної ціни
    minPrice: function() {
        var prices = [];
        for (var key in this) {
            if (typeof this[key] === "string" && this[key].includes("грн")) {
                prices.push(parseFloat(this[key]));
            }
        }
        return Math.min(...prices) + " грн";
    },

    maxPrice: function() {
        var prices = [];
        for (var key in this) {
            if (typeof this[key] === "string" && this[key].includes("грн")) {
                prices.push(parseFloat(this[key]));
            }
        }
        return Math.max(...prices) + " грн";
    }
};

services["Фарбування"] = "200 грн";
services["Реконструкція"] = "300 грн";
services["Ламінування"] = "180 грн";
services["Цьом в лобік"] = "30 грн";

console.log("Усі послуги:", services);
console.log("Загальна вартість:", services.price());
console.log("Мінімальна ціна:", services.minPrice());
console.log("Максимальна ціна:", services.maxPrice());

/*
Створюється обʼєкт з ключами - назва послуги і значенням ціни яке рядок
Створила метод прайс, через цикл перебираємо властивості обʼєкта
Шукаємо мінімальну і максимальтні ціни
Добаю ще послуги і щоб метод їх враховував
*/