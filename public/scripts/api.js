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

const buildMessage = (messageContainer, messages) => {
    const messageIcon = document.createElement('img');
    const messageInformation = document.createElement('div');
    const headerContainer = document.createElement('div');
    const messageClose = document.createElement('button');

    messageInformation.classList.add('message-information');
    headerContainer.classList.add('message-header');
    messageClose.classList.add('message-close');

    messageInformation.textContent = messages;
    messageClose.textContent = 'X';

    messageClose.addEventListener('click', () => {
        messageContainer.classList.remove('success-message');
        messageContainer.classList.remove('error-message');
        messageContainer.parentElement.classList.add('hidden');
        messageContainer.innerHTML = '';
    });

    headerContainer.appendChild(messageIcon);
    headerContainer.appendChild(messageInformation);

    return { headerContainer, messageClose, messageIcon };
}

const handleMessages = (status, messages) => {
    const iconPath = '/images/icons'
    const messageContainer = document.querySelector('.messages');
    messageContainer.parentElement.classList.remove('hidden');
    messageContainer.innerHTML = '';

    const { headerContainer, messageClose, messageIcon } = buildMessage(messageContainer, messages);

    if (status === 200) {
        messageContainer.classList.add('success-message');
        messageIcon.src = `${iconPath}/success.svg`;
    } else if (status === 400) {
        messageContainer.classList.add('error-message');
        messageIcon.src = `${iconPath}/error.svg`;
    }
    messageContainer.appendChild(headerContainer);
    messageContainer.appendChild(messageClose);
};
