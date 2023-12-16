import ModelTask from './ModelTask.js';

export default class Kanban {
    constructor() {
        this.#loadData();
        window.addEventListener('beforeunload', () => {
            this.#saveData();
        });
    }

    #tasks;

    #localStorageKeys = {
        tasks: 'tasks',
    };

    /**
     * @return {ModelTask[]}
     */
    get tasks() {
        return this.#tasks;
    }

    /**
     * Add the Task to newTask array in order NEW -> OLD
     * @param task {ModelTask}
     */
    addTask(task) {
        this.#tasks.push(task);
    }

    /**
     * Change Kanban data structure on moving task
     */
    moveTaskBetweenColumns(movingElementIndex, destinationColumnName) {
        this.#tasks[movingElementIndex].group = destinationColumnName;
    }

    /**
     * Save data of arrays to local storage
     */
    #saveData = () => {
        this.tasks.sort((taskA, taskB) => {
            return taskB.order - taskA.order;
        });
        this.tasks.forEach((task, index, tasks) => {
            task.order = tasks.length - 1 - index;
            task.index = index;
        });
        // eslint-disable-next-line max-len
        window.localStorage.setItem(this.#localStorageKeys.tasks, this.#deserializeTasks(this.tasks));
    };

    /**
     * Load new, in progress and done the tasks from localStorage
     */
    #loadData() {
        // eslint-disable-next-line max-len
        this.#tasks = this.#serializeTasks(window.localStorage.getItem(this.#localStorageKeys.tasks));
    }

    /**
     * Convert tasks to JSON
     * @param taskArray
     * @return {string}
     */
    #deserializeTasks(taskArray) {
        return JSON.stringify(taskArray.map(task => task.json));
    }

    /**
     * Convert JSON array to task data structure
     * @param taskArrayJSON {string}
     * @return {Array}
     */
    #serializeTasks = taskArrayJSON => {
        return JSON.parse(taskArrayJSON)?.map(task => ModelTask.serialize(task)) ?? [];
    };
}
