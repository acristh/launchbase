const currentPage = location.pathname;
const menuItens = document.querySelectorAll("header .links a");

for (const item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    }
}

// Paginação
// [1, ..., 13,]

let totalPages = 20,
selectedPage = 15,
pages = []

for(let currentPage = 0, currentPage <= totalPages; currentPage++){
    pages.push(currentPage)
}

console.log(pages);
