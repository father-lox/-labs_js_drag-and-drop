export default class RenderTask {
    static attributes = {
        order: 'data-order',
        index: 'data-index',
    };

    #template = document.getElementById('task-template');

    /**
     *
     * @param task {ModelTask} - Data model of Task
     * @return {HTMLDivElement}
     */
    renderTask = task => {
        /** @type {HTMLDivElement} */
        const taskElement = this.#template.content.firstElementChild.cloneNode(true);

        taskElement.querySelector('[data-role=task-title]').innerText = task.title;
        taskElement.querySelector('[data-role=task-detail]').innerText = task.detail;
        RenderTask.setOrder(taskElement, task.order);
        RenderTask.setIndex(taskElement, task.index);

        return taskElement;
    };

    /**
     * Get order of Task Element
     * @param task {HTMLDivElement}
     * @return {number}
     */
    static getOrder(task) {
        return Number.parseInt(task.getAttribute(RenderTask.attributes.order), 10);
    }

    /**
     * Set new data-order attribute to the task element
     * @param task {HTMLDivElement}
     * @param order {number}
     */
    static setOrder(task, order) {
        task.setAttribute(RenderTask.attributes.order, order.toString());
    }


    /**
     * Get data-index attribute
     * @param task {HTMLDivElement}
     * @return {number}
     */
    static getIndex(task) {
        return Number(task.getAttribute(RenderTask.attributes.index));
    }

    /**
     * Set data-index attribute to the task node
     * @param task {HTMLElement}
     * @param index {number}
     */
    static setIndex(task, index) {
        task.setAttribute(RenderTask.attributes.index, index.toString());
    }
}
