const currentPage = location.pathname;
const menuItens = document.querySelectorAll("header .links a");

for (const item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    }
}
console.log(menuItens);

