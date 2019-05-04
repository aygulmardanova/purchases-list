import {Purchase} from "./lib.js";

const inputNameEl = document.getElementById('name');
const inputCategoryEl = document.getElementById('category');
const inputPriceEl = document.getElementById('price');
const addEl = document.getElementById('add-btn');
const tableEl = document.getElementById('purchases');
const sumEl = document.getElementById('purchases-sum');

const mostExpensivePEl = document.getElementById('most-expensive-p');
const mostExpensiveCEl = document.getElementById('most-expensive-c');
const statsTotalEl = document.getElementById('stats-total');
const statsCountEl = document.getElementById('stats-count');

const indOfNameCell = 0;
const indOfCategoryCell = 1;
const indOfPriceCell = 2;
const indOfRemoveBtnCell = 3;

let sum = 0;
let purchases = [];
let categories = new Map();

addEl.addEventListener('click', getAddElEventListener());
addEl.addEventListener('click', getUpdateStatisticsFunction());

export function getAddElEventListener() {
    return () => {
        const name = inputNameEl.value;
        const category = inputCategoryEl.value;
        const price = Number(inputPriceEl.value);

        const purchase = new Purchase(name, category, price);
        purchases.push(purchase);
        if (categories.get(purchase.category) != null)
            categories.set(purchase.category, categories.get(purchase.category) + purchase.price);
        else
            categories.set(purchase.category, purchase.price);

        const trEl = tableEl.insertRow();

        const tdNameEl = trEl.insertCell(indOfNameCell);
        tdNameEl.textContent = name;

        const tdCategoryEl = trEl.insertCell(indOfCategoryCell);
        tdCategoryEl.textContent = category;

        const tdPriceEl = trEl.insertCell(indOfPriceCell);
        tdPriceEl.textContent = price;

        const removeEl = document.createElement('button');
        removeEl.className = 'btn btn-sm btn-danger';
        removeEl.textContent = 'Remove';
        removeEl.addEventListener('click', getRemoveElEventListener(trEl));
        removeEl.addEventListener('click', getUpdateStatisticsFunction());

        const tdRemoveEl = trEl.insertCell(indOfRemoveBtnCell);
        tdRemoveEl.appendChild(removeEl);

        sum += price;
        sumEl.textContent = sum;

        [inputNameEl, inputCategoryEl, inputPriceEl]
            .forEach(el => el.value = '');
    };
}

export function getRemoveElEventListener(trEl) {
    return () => {
        const purchase =
            purchases.find(p =>
                p.name === trEl.cells[indOfNameCell].textContent);
        sum -= Number(purchase.price);
        sumEl.textContent = sum;

        if (categories.get(purchase.category) != null)
            categories.set(purchase.category, categories.get(purchase.category) - purchase.price);
        else
            categories.remove(purchase.category);

        purchases.splice(purchases.indexOf(purchase), 1);
        tableEl.deleteRow(trEl.rowIndex);
    };
}

export function getUpdateStatisticsFunction() {
    return () => {
        updateMostExpensivePurchaseInfo();
        updateMostExpensiveCategoryInfo();
        updateStatsInfo();
    };
}

export function updateMostExpensivePurchaseInfo() {
    if (purchases.length === 0) {
        mostExpensivePEl.cells[0].textContent = '';
        mostExpensivePEl.cells[1].textContent = '';
        mostExpensivePEl.cells[2].textContent = '';
        return;
    }

    const maxP = purchases
        .reduce((p1, p2) =>
            (p1.price > p2.price)
                ? p1
                : p2, 0);
    mostExpensivePEl.cells[0].textContent = maxP.name;
    mostExpensivePEl.cells[1].textContent = maxP.category;
    mostExpensivePEl.cells[2].textContent = maxP.price;
}

export function updateMostExpensiveCategoryInfo() {
    if (purchases.length === 0) {
        mostExpensiveCEl.cells[0].textContent = '';
        mostExpensiveCEl.cells[1].textContent = '';
        mostExpensiveCEl.cells[2].textContent = '';
        return;
    }

    const maxC = [...categories.entries()]
        .reduce((maxSum, sum) =>
            sum[1] > maxSum[1]
                ? sum
                : maxSum);
    mostExpensiveCEl.cells[0].textContent = maxC[0];
    mostExpensiveCEl.cells[1].textContent = maxC[1];
}

export function updateStatsInfo() {
    statsTotalEl.cells[1].textContent = sum;
    statsCountEl.cells[1].textContent = purchases.length;
}