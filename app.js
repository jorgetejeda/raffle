const express = require("express");
const path = require("path");

const participantRoute = require('./src/route/participant');
const winnerRoute = require('./src/route/winner');
const awardRoute = require('./src/route/award');

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(participantRoute, winnerRoute, awardRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
})

app.get('/participants', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/participants.html'));
})

app.get('/awards', (req, res) => {
res.sendFile(path.join(__dirname, 'public/pages/awards.html'));
})

app.get('/raffle', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/raffle.html'));
})

app.get('/winners', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/winners.html'));
})

app.listen(PORT, () => {
    const resetColor = '\x1b[0m';
    const greenColor = '\x1b[32m';
    const yellowColor = '\x1b[33m';
    const cyanColor = '\x1b[36m';

    isFirstRun = false;
    // Título de bienvenida
    console.log('');
    console.log(greenColor, '¡Bienvenido a Raffle App!', resetColor);
    console.log(greenColor, '   -------------------', resetColor);
    console.log('');

    // Mensajes informativos con colores
    console.log(cyanColor, 'Para una mejor experiencia, la aplicación se ejecuta en el DNS "raffle-app", que debe estar configurado previamente en tu host de Windows o Mac.', resetColor);
    console.log(cyanColor, 'Si aún no has configurado el DNS en tu host, puedes acceder a la aplicación mediante el puerto 3500.', resetColor);
    console.log('');

    // Enlaces para acceder a la aplicación
    console.log(yellowColor, 'Usar DNS:        ', `http://raffle-app.crecer:${PORT}`, resetColor);
    console.log(yellowColor, 'Usar Localhost:  ', `http://localhost:${PORT}`, resetColor);
});

