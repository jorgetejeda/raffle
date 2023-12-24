const MESSAGE = {
    200: 'La solicitud se ha procesado correctamente.',
    400: 'La solicitud no se ha procesado correctamente.',
    404: 'No hay data disponibles.',
};

const createHTTPResponse = (status, msg) => ({ status, message: msg || MESSAGE[status] });

const HTTP_RESPONSE = {
    200: (msg) => createHTTPResponse(200, msg),
    400: (msg) => createHTTPResponse(400, msg),
    404: (msg) => createHTTPResponse(404, msg),
};

module.exports = HTTP_RESPONSE;
