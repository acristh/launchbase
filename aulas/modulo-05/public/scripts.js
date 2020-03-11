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
selectedPage = 5,
pages = [],
oldPage

for(let currentPage = 0; currentPage <= totalPages; currentPage++){
    
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;
    const isFirstOrLastPage = currentPage == 1 || currentPage == totalPages;
    

    if (isFirstOrLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
        
        if(oldPage && currentPage - oldPage > 2){
            pages.push('...');
        }

        if(oldPage && currentPage - oldPage == 2){
            pages.push(oldPage +1);
        }
        
        pages.push(currentPage);

        oldPage = currentPage;
    }
}

console.log(pages);
