import RenderTask from './RenderTask.js';

export default class RenderKanban extends RenderTask {
    #taskRenderer = new RenderTask();

    #nameInitialColumn = 'new';

    #kanbanColumns = {
        new: {
            name: this.#nameInitialColumn,
            element: document.getElementById('kanban-new'),
        },
        inProgress: {
            name: 'inProgress',
            element: document.getElementById('kanban-in-progress'),
        },
        done: {
            name: 'done',
            element: document.getElementById('kanban-done'),
        },
    };

    get nameInitialColumn() {
        return this.#nameInitialColumn;
    }

    /**
     * Display task in kanban columns and return the displayed element
     * @param tasks {ModelTask | ModelTask[]}
     * @return {HTMLDivElement}
     */
    displayTask = tasks => {
        const taskElement = this.#taskRenderer.renderTask(tasks);

        this.#kanbanColumns[tasks.group].element.prepend(taskElement);

        return taskElement;
    };

    /**
     * Display tasks in kanban columns and return an array of displayed items
     * @param tasks {ModelTask[]}
     * @return {HTMLDivElement[]}
     */
    displayManyTasks(tasks) {
        const taskElements = new Array(tasks.length);

        tasks.forEach((task, index) => {
            taskElements[index] = this.displayTask(task);
        });

        return taskElements;
    }
}
