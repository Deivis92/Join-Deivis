let currendId = 5;

function loadUserIdLocalStorage() {
    const idAsText = localStorage.getItem('userId');
    userId = idAsText ? JSON.parse(idAsText) : '';
}

function renderContacts() {
    const content = document.getElementById('contacts-content');
    content.innerHTML = '';
    content.innerHTML = createButtonCard();
    let groupedNames = giveGroupedContacts();
    for (const k in groupedNames) {
        if (Object.hasOwnProperty.call(groupedNames, k)) {
            const elements = groupedNames[k];
            content.innerHTML += createLetterCard(k);
            elements.forEach(element => {
                const initials = `${getFirstLetterOfName(element.name)}${getFirstLetterOfName(element.surname)}`;
                content.innerHTML += createContactCard(element, initials);
            });
        }
    }
}

function giveGroupedContacts() {
    let names = sortContactsByName();
    return groupedNames = groupByInitials(names);
}

function renderContactDetailCard(id, initials) {
    const content = document.getElementById('contact-detail-card');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createDetailedContactCard(id, initials);
    content.classList.add('slide-in');
}

function closeContactDetailCard() {
    const content = document.getElementById('contact-detail-card');
    content.innerHTML = '';
}

function renderEditOverlay(id, initials) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createEditOverlay(id, initials);
}

function renderAddOverlay(id) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createAddOverlay(id);
}

function closeOverlay() {
    const content = document.getElementById('overlay-section');
    content.style.display = 'none';
}

function deleteContact(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
    }
    closeContactDetailCard();
    renderContacts();
}

function deleteContactOverlay(id) {
    closeOverlay();
    closeContactDetailCard();
    setTimeout(() => {
        const index = contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            contacts.splice(index, 1);
        }
        renderContacts();
    }, 0);
}

function sortContactsByName() {
    let names = contacts.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    });
    return names
}

function groupByInitials(arr) {
    return arr.reduce((acc, user) => {
        const initial = user.name.charAt(0).toUpperCase();
        if (!acc[initial]) {
            acc[initial] = [];
        }
        acc[initial].push({ id: user.id, name: user.name, surname: user.surname, email: user.email, phoneNumber: user.phoneNumber, color: user.color });
        return acc;
    }, {});
}

function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name.toUpperCase()
}

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function addContact() {
    const fullnameArr = document.getElementById('add-name-overlay').value.split(" ");
    const [name, surname] = fullnameArr;
    const email = document.getElementById('add-email-overlay').value;
    const phoneNumber = document.getElementById('add-phoneNumber-overlay').value;
    const colorArr = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    const rand = Math.floor(Math.random() * colorArr.length);
    const color = colorArr[rand];
    currendId = currendId + 1;
    contacts.push({ id: currendId, name: name, surname: surname, email: email, phoneNumber: phoneNumber, color: color });
    closeOverlay();
    renderContacts();
}

function editContact(id, initials) {
    const contact = getObjectById(contacts, id);
    const fullnameArr = document.getElementById('edit-name-overlay').value.split(" ");
    const [name, surname] = fullnameArr;
    contact.name = name;
    contact.surname = surname;
    contact.email = document.getElementById('edit-email-overlay').value;
    contact.phoneNumber = document.getElementById('edit-phoneNumber-overlay').value;
    closeOverlay();
    renderContacts();
    renderContactDetailCard(id, initials);
}