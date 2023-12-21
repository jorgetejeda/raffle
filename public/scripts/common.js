const RAFFLE_PATH = '/raffle';
document.addEventListener("DOMContentLoaded", () => {
    const pathname = window.location.pathname;
    getTemplateColors()
    if (pathname !== RAFFLE_PATH) {
        buildHeader();
        buildMenu();
    }
    buildFooter();
});

const getTemplateColors = async () => {
    const { configuration, status } = await callIn('GET', '/api/configuration');
    if (status === 400) {
        return;
    }
    const r = document.querySelector(':root')

    const { mainColor, secondaryColor, mainImage, headerImage } = configuration;

    r.style.setProperty('--main-color', mainColor);
    const darkerColor = shadeColor(mainColor, -50)
    r.style.setProperty('--main-dark-color', darkerColor);
    const lightColor = shadeColor(mainColor, 50)
    r.style.setProperty('--main-light-color', lightColor);
    const lightenerColor = shadeColor(mainColor, 2600)
    r.style.setProperty('--main-lighter-color', lightenerColor);
    r.style.setProperty('--secondary-color', secondaryColor);
}

const buildHeader = () => {
    // header not id="raffle"
    const header = document.querySelector('header:not(#raffle)');
    header.innerHTML = `
        <div class="container d-flex flex-row items-between px-1">
            <a href="/" class="icon-button">
                <img src="images/Logos/Isologo Crecer blanco.png" alt="logo-header" width="40"  title="Ir a página principal"/>
            </a>
            <a href="/configurations" class="icon-button">
                <img src="images/settings.svg" width="40" title="Ir a configuración de la aplicación"/>
            </a>
        </div>
        
    `
}

const buildMenu = () => {
    const pathname = window.location.pathname;

    const menuItems = [
        { href: '/', text: 'Subir archivo', icon: 'M4 3.99999C4 3.26457 4.59792 2.66666 5.33333 2.66666H8.66667V5.33332C8.66667 5.70207 8.96458 5.99999 9.33333 5.99999H12V12C12 12.7354 11.4021 13.3333 10.6667 13.3333H5.33333C4.59792 13.3333 4 12.7354 4 12V3.99999Z' },
        { href: '/awards', text: 'Editar sorteo', icon: 'M12.5714 6.85713H9.14286V3.42856C9.14286 3.00785 8.80167 2.66666 8.38095 2.66666H7.61905C7.19833 2.66666 6.85714 3.00785 6.85714 3.42856V6.85713H3.42857C3.00786 6.85713 2.66667 7.19832 2.66667 7.61904V8.38094C2.66667 8.80166 3.00786 9.14285 3.42857 9.14285H6.85714V12.5714C6.85714 12.9921 7.19833 13.3333 7.61905 13.3333H8.38095C8.80167 13.3333 9.14286 12.9921 9.14286 12.5714V9.14285H12.5714C12.9921 9.14285 13.3333 8.80166 13.3333 8.38094V7.61904C13.3333 7.19832 12.9921 6.85713 12.5714 6.85713Z' },
        { href: '/participants', text: 'Ver participantes', icon: 'M8 8.66666C9.65625 8.66666 11 7.32291 11 5.66666C11 4.01041 9.65625 2.66666 8 2.66666C6.34375 2.66666 5.00001 4.01041 5.00001 5.66666C5.00001 7.32291 6.34375 8.66666 8 8.66666ZM10.6667 9.33332H9.51875C9.05625 9.54582 8.54167 9.66666 8 9.66666C7.45834 9.66666 6.94584 9.54582 6.48126 9.33332H5.33334C3.86042 9.33332 2.66667 10.5271 2.66667 12V12.3333C2.66667 12.8854 3.11459 13.3333 3.66667 13.3333H12.3333C12.8854 13.3333 13.3333 12.8854 13.3333 12.3333V12C13.3333 10.5271 12.1396 9.33332 10.6667 9.33332Z' },
        { href: '/winners', text: 'Exportar ganadores', icon: 'M8 8.66666C9.65625 8.66666 11 7.32291 11 5.66666C11 4.01041 9.65625 2.66666 8 2.66666C6.34375 2.66666 5.00001 4.01041 5.00001 5.66666C5.00001 7.32291 6.34375 8.66666 8 8.66666ZM10.6667 9.33332H9.51875C9.05625 9.54582 8.54167 9.66666 8 9.66666C7.45834 9.66666 6.94584 9.54582 6.48126 9.33332H5.33334C3.86042 9.33332 2.66667 10.5271 2.66667 12V12.3333C2.66667 12.8854 3.11459 13.3333 3.66667 13.3333H12.3333C12.8854 13.3333 13.3333 12.8854 13.3333 12.3333V12C13.3333 10.5271 12.1396 9.33332 10.6667 9.33332Z' },
        { href: '/raffle', text: 'Ir a la rifa', viewBox: "0 0 576 512", icon: 'M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z' },
    ];

    // Obtener el elemento de la lista del menú
    const menuList = document.getElementById('menu-list');
    const ul = document.createElement('ul');

    // Iterar sobre la matriz de elementos del menú y crear elementos HTML
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        // Configurar atributos del enlace
        a.href = item.href;
        a.textContent = item.text;

        // Configurar atributos del SVG
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.innerHTML = `<path d="${item.icon}" />`;
        item.viewBox && svg.setAttribute('viewBox', item.viewBox);

        // Agregar elementos al DOM
        a.insertBefore(svg, a.firstChild);
        li.appendChild(a);
        ul.appendChild(li);
        menuList.appendChild(ul);
    });
    menuList.querySelector(`a[href="${pathname}"]`).classList.add('active');
}

const buildFooter = () => {
    const isRaffle = window.location.pathname;
    const footer = document.querySelector('footer');
    const images = isRaffle === RAFFLE_PATH ? 'Logos Crecer - blancos-01.png' : 'Logos Crecer 2 - Gris-01.png';
    console.log('footer')
    footer.innerHTML = `
        <div class="container">
            <div class="divider"></div>
            <div class="content">
                <span class="right-reserved">
                    ©2023. Todos los derechos reservados.
                </span>
                <img src="images/Logos/${images}" alt="logo" />
            </div>
        </div>
   
    `
}

const capitalize = (string) => {
    return string.toLowerCase().split(' ').map(name => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }).join(' ');
}

const currencyFormat = (value) => {
    if (value === '') {
        value = '0';
    }
    const options = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true,
    };
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', ...options }).format(
        parseInt(value)
    );
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}