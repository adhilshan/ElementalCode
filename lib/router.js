import 'https://code.jquery.com/jquery-3.6.0.min.js';

const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

function getPage(pageName) {
    return new Promise((resolve, reject) => {
        $.get("/Pages/" + pageName + '.elm', function(data) {
            resolve(data);
        }).fail(function() {
            $.get("/Pages/404.elm", function(errorPage) {
                resolve(errorPage);
            });
        });
    });
}

const router = async () => {
    const path = window.location.pathname;
    const routeElement = document.querySelector(`a[href='${path}']`);
    
    if (routeElement) {
        const pageName = routeElement.getAttribute('data-route');
        const content = await getPage(pageName);
        document.getElementById("app").innerHTML = content;
    } else {
        const errorContent = await getPage('404');
        document.getElementById("app").innerHTML = errorContent;
    }
};

document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", router);
