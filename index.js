import Kanban from './src/Kanban.js';

const kanban = new Kanban();
/** @type {HTMLDialogElement} */
const dialog = document.querySelector('dialog');
/** @type {HTMLButtonElement} */
const closeModal = document.querySelector('[data-role=close-modal]');
/** @type {HTMLButtonElement} */
const openModal = document.querySelector('[data-role=show-modal]');

openModal.addEventListener('click', () => {
    dialog.showModal();
});

closeModal.addEventListener('click', () => {
    dialog.close();
});

document.forms[0].addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(this).entries());

    kanban.addTask(formData.title, formData.detail);
    dialog.close();
    this.reset();
});
