import ModelKanban from './models/ModelKanban.js';
import RenderKanban from './renderers/RenderKanban.js';
import ModelTask from './models/ModelTask.js';
import DragAndDrop from './DragAndDrop.js';
import RenderTask from './renderers/RenderTask.js';

export default class Kanban {
    constructor() {
        this.#tasksElements = this.#kanbanRenderer.displayManyTasks(this.#modelKanban.tasks);
        this.#taskDragAndDropController = new DragAndDrop('task', '.kanban-tasks-container', this.#tasksElements);
        document.getElementById('kanban').addEventListener('dropElement', this.#onDropElement);
    }

    #modelKanban = new ModelKanban();

    #kanbanRenderer = new RenderKanban();

    #taskDragAndDropController;

    #tasksElements;

    /**
     * Add the Task to newTask array
     * @param title {string}
     * @param detail {string}
     */
    addTask(title, detail) {
        const addingTask = new ModelTask(
            title,
            detail,
            this.#kanbanRenderer.nameInitialColumn,
            this.#modelKanban.tasks.length,
            0,
        );

        this.#modelKanban.addTask(addingTask);
        const newTaskElement = this.#kanbanRenderer.displayTask(addingTask);

        this.#tasksElements.push(newTaskElement);

        this.#updateOrderElementsBelow(newTaskElement);

        this.#taskDragAndDropController.initEventsOnDraggableElements(newTaskElement);
    }

    /**
     * @param startElement {HTMLElement}
     */
    #updateOrderElementsBelow(startElement) {
        if (startElement.nextElementSibling) {
            const indexNextElement = RenderTask.getIndex(startElement.nextElementSibling);
            const newOrderNextElement = RenderTask.getOrder(startElement.nextElementSibling) + 1;

            this.#modelKanban.tasks[indexNextElement].order = newOrderNextElement;
            RenderTask.setOrder(this.#tasksElements[indexNextElement], newOrderNextElement);

            this.#updateOrderElementsBelow(startElement.nextElementSibling);
        }
    }

    #updateElementOrder(element) {
        const indexCurrentElement = RenderTask.getIndex(element);
        let newOrderCurrentElement = 0;

        if (element.previousElementSibling) {
            newOrderCurrentElement = RenderTask.getOrder(element.previousElementSibling) + 1;
        }

        this.#modelKanban.tasks[indexCurrentElement].order = newOrderCurrentElement;
        RenderTask.setOrder(this.#tasksElements[indexCurrentElement], newOrderCurrentElement);
    }

    #onDropElement = event => {
        /** @type {HTMLDivElement} */
        const taskElement = event.detail.element;
        const indexMovingTask = RenderTask.getIndex(taskElement);
        const destinationColumnName = event.detail.destination.getAttribute('data-kanban-column-name');

        this.#updateElementOrder(taskElement);
        this.#updateOrderElementsBelow(taskElement);

        this.#modelKanban.moveTaskBetweenColumns(indexMovingTask, destinationColumnName);
    };
}
