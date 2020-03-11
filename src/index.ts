import { registerApplication, start, navigateToUrl } from "single-spa";

registerApplication(
    "madrox",
    // @ts-ignore
    () => import('madrox/Madrox'),
    () => {
        return location.pathname.indexOf("/madrox") === 0;
    }
);

registerApplication(
    "saturn",
    // @ts-ignore
    () => import('saturn/Saturn'),
    () => {
        return location.pathname.indexOf("/saturn") === 0;
    }
);

// @ts-ignore
document.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target && e.target.nodeName === 'A') {
        navigateToUrl(e.target.getAttribute('href'));
    }
});

start();