const formElem = document.querySelector('form');
const allUsersSection = document.querySelector('#allusers .row');
const submitBtn = document.querySelector('form [type="submit"]');
const showHideFormBtn = document.querySelector('#showHideForm');

let users = [];
let isEditMode = false;
let currentCard;

const formControls = ['name', 'email', 'phone', 'address'];
const submitBtnText = {
    add: 'Add User',
    edit: 'Edit User'
}
const showHideFormBtnText = {
    show: 'Show Form',
    hide: 'Hide Form'
}

showHideFormBtn.addEventListener('click', (e) => {
    formElem.classList.toggle('d-none');
    formElem.classList.toggle('opened');
    e.target.textContent = formElem.classList.contains("opened")
      ? showHideFormBtnText.hide
      : showHideFormBtnText.show;
});

const setUsers = () => localStorage.setItem('users', JSON.stringify(users));
const getUsers = () => users = JSON.parse(localStorage.getItem('users')) || [];

const deleteUser = (user) => {
    let indx = users.findIndex(u => user.id === u.id);
    users.splice(indx, 1);
    setUsers();
    showUsers()
}

const editUser = (user, e) => {
    users = getUsers();
    formElem.className = 'opened';
    showHideFormBtn.textContent = 'Hide Form';
    formControls.map(control => formElem.elements[control].value = user[control]);
    submitBtn.value = submitBtnText.edit;
    currentCard = e.target.parentElement.parentElement;
}

const showUser = (user) => {
    let userCard = `
        <div class="col-4">
            <div class="m-3 border border-secondary border-2 p-3">
                <h3>${user.name}</h3>
                <p class="m-0">${user.email}</p>
                <p class="m-0">${user.phone}</p>
                <p class="m-0 mb-3">${user.address}</p>
                <button class="btn btn-danger" id="del-${user.id}">Delete</button>
                <button class="btn btn-success" id="edit-${user.id}">Edit</button>
            </div>
        </div>
    `;

    isEditMode
      ? currentCard.outerHTML = userCard
      : allUsersSection.insertAdjacentHTML("beforeend", userCard);
    
    document.querySelector(`#del-${user.id}`).addEventListener('click', () => deleteUser(user));
    document.querySelector(`#edit-${user.id}`).addEventListener('click', (e) => editUser(user, e));
}

const showUsers = () => {
    users = getUsers();
    allUsersSection.innerHTML = "";
    if (users.length === 0) return allUsersSection.insertAdjacentHTML('beforeend', `
        <div class="alert alert-danger">No Data To Show</div>
    `);
    users.map(user => showUser(user));
}

const setUserObj = (user, e) => formControls.map(control => user[control] = e.target.elements[control].value);

const resetForm = (e) => {
    submitBtn.value = submitBtnText.add;
    e.target.reset()
    isEditMode = false;
}

const formAdd = (user, e) => {
    isEditMode = false;
    user = { id: new Date().getTime() };
    setUserObj(user, e);
    if (users.length === 0) allUsersSection.innerHTML = "";
    users.push(user);
    return user;
}

const formEdit = (user, e) => {
    isEditMode = true;
    let i = [...allUsersSection.children].indexOf(currentCard);
    user = users[i];
    setUserObj(user, e);
    return user;
}

formElem.addEventListener('submit', (e) => {
    e.preventDefault();
    let user;
    user = (submitBtn.value === submitBtnText.add) ? formAdd(user, e) : formEdit(user, e);
    setUsers();
    showUser(user);
    resetForm(e);
    formElem.className = 'd-none';
    showHideFormBtn.textContent = showHideFormBtnText.show;
});

showUsers();
