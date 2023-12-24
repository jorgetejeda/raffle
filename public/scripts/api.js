const callIn = async (method, route, body) => {
    const response = await fetch(route, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return response.json();
}