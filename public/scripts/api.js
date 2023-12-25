const callIn = async (method, route, body) => {
    const response = await fetch(`api${route}`, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

const buildMessage = (messageContainer, messages) => {
    const createElem = (tag, classNames = []) => {
        const element = document.createElement(tag);
        element.classList.add(...classNames);
        return element;
    };

    const messageIcon = createElem('img');
    const messageInformation = createElem('div', ['message-information']);
    const headerContainer = createElem('div', ['message-header']);
    const messageClose = createElem('button', ['message-close']);

    messageInformation.textContent = messages;
    messageClose.textContent = 'X';

    messageClose.addEventListener('click', () => {
        messageContainer.classList.remove('success-message', 'error-message');
        messageContainer.parentElement.classList.add('hidden');
        messageContainer.innerHTML = '';
    });

    headerContainer.append(messageIcon, messageInformation);

    return { headerContainer, messageClose, messageIcon };
};

const handleMessages = (status, messages) => {
    const iconPath = '/images/icons'
    const SUCCESS_RESPONSE = 200;

    const messageContainer = document.querySelector('.messages');
    messageContainer.parentElement.classList.remove('hidden');
    messageContainer.innerHTML = '';

    const { headerContainer, messageClose, messageIcon } = buildMessage(messageContainer, messages);

    const isSuccess = status === SUCCESS_RESPONSE; 
    messageContainer.classList.add(isSuccess ? 'success-message' : 'error-message');
    messageIcon.src = isSuccess ? `${iconPath}/success.svg` : `${iconPath}/error.svg`;

    messageContainer.appendChild(headerContainer);
    messageContainer.appendChild(messageClose);
};
