/**
 * Drag and drop mechanism
 * @param {string} selectorDraggableElements - Selector of the elements that can be dragged
 * @param {string} selectorDropLocations - The places where the elements can be dropped
 * @param {HTMLElement[]} [draggableElements=null] - Elements that can be dragged
 */
export default class DragAndDrop {
    constructor(
        classDraggableElements,
        selectorDropLocations,
        draggableElements = null,
    ) {
        if (draggableElements === null) {
            draggableElements = Array.from(document.getElementsByClassName(classDraggableElements));
        }

        draggableElements.forEach(element => {
            this.initEventsOnDraggableElements(element);
        });

        this.#selectorDropLocations = selectorDropLocations;
        this.#selectorDraggableElements = `.${classDraggableElements}`;
    }

    #selectorDropLocations = '';

    #selectorDraggableElements = '';

    #draggableElement = null;

    #draggableElementPlaceholder = document.createElement('div');

    #grabCoordinationX = 0;

    #grabCoordinationY = 0;

    #currentDropLocation = null;

    #locationBelowCursor = null;

    /**
     * @param event {MouseEvent}
     */
    grab = event => {
        if (event.button || event.ctrlKey) {
            return;
        }

        this.#draggableElement = event.currentTarget;
        this.#grabCoordinationX = event.clientX - this.#draggableElement.getBoundingClientRect().left;
        this.#grabCoordinationY = event.clientY - this.#draggableElement.getBoundingClientRect().top;
        this.#currentDropLocation = this.#draggableElement?.closest(this.#selectorDropLocations);
        this.#locationBelowCursor = null;

        this.#setPlaceholderSize(this.#draggableElement);
        this.#fixAppearanceElement(this.#draggableElement);
        this.#draggableElement.before(this.#draggableElementPlaceholder);
        document.addEventListener('mousemove', this.move);
    };

    move = event => {
        this.#setAbsolutePosition();

        this.#draggableElement.style.pointerEvents = 'none';

        const draggableElementUnderCursor = document.elementFromPoint(event.clientX, event.clientY)?.closest(this.#selectorDraggableElements);

        if (draggableElementUnderCursor) {
            const draggableElementCenterPage = this.#getCenterYElementRelativePage(draggableElementUnderCursor);

            if (event.pageY < draggableElementCenterPage && draggableElementUnderCursor.previousElementSibling !== this.#draggableElementPlaceholder) {
                draggableElementUnderCursor.before(this.#draggableElementPlaceholder);
            } else if (event.pageY >= draggableElementCenterPage && draggableElementUnderCursor.nextElementSibling !== this.#draggableElementPlaceholder) {
                draggableElementUnderCursor.after(this.#draggableElementPlaceholder);
            }
        } else {
            this.#locationBelowCursor = document.elementFromPoint(event.clientX, event.clientY)?.closest(this.#selectorDropLocations);

            if (this.#locationBelowCursor !== this.#currentDropLocation && this.#locationBelowCursor) {
                this.#removeHighlightDropPlace();
            }

            if (this.#locationBelowCursor !== this.#currentDropLocation && this.#locationBelowCursor) {
                this.#highlightDropPlace(event.pageY);
                this.#draggableElementPlaceholder.remove();
                this.#currentDropLocation = this.#locationBelowCursor;
            }
        }
        this.#draggableElement.style.pointerEvents = 'auto';
    };

    drop = event => {
        if (this.#currentDropLocation && !this.#currentDropLocation.contains(this.#draggableElementPlaceholder)) {
            const draggableElementCenterPage = this.#getCenterYElementRelativePage(this.#currentDropLocation);

            if (event.pageY >= draggableElementCenterPage) {
                this.#currentDropLocation.append(this.#draggableElement);
            } else {
                this.#currentDropLocation.prepend(this.#draggableElement);
            }
        } else if (this.#currentDropLocation && this.#currentDropLocation.contains(this.#draggableElementPlaceholder)) {
            this.#draggableElementPlaceholder.replaceWith(this.#draggableElement);
        }

        this.#currentDropLocation.dispatchEvent(this.#dropElement({
            element: this.#draggableElement,
            destination: this.#currentDropLocation,
        }));
        this.#removeHighlightDropPlace();

        this.#setInitialStyles(this.#draggableElement);
        document.removeEventListener('mousemove', this.move);
    };

    #setAbsolutePosition() {
        this.#draggableElement.style.left = (event.pageX - this.#grabCoordinationX).toString().concat('px');
        this.#draggableElement.style.top = (event.pageY - this.#grabCoordinationY).toString().concat('px');
    }

    /**
     * @param element {HTMLElement}
     */
    initEventsOnDraggableElements = element => {
        element.addEventListener('mousedown', this.grab);
        element.addEventListener('mouseup', this.drop);
    };

    /**
     * @param element {HTMLElement}
     * @return {number}
     */
    #getCenterYElementRelativePage = element => {
        return element.offsetTop + (element.offsetHeight / 2);
    };

    #dropElement = (detail = {}) => {
        return new CustomEvent('dropElement', {
            bubbles: true,
            detail,
        });
    };

    #setPlaceholderSize(draggableElement) {
        this.#draggableElementPlaceholder.style.width = draggableElement.getBoundingClientRect().width.toString().concat('px');
        this.#draggableElementPlaceholder.style.height = draggableElement.getBoundingClientRect().height.toString().concat('px');
    }

    /**
     * Fix the appearance of the element before moving it
     * @param node {HTMLElement}
     */
    #fixAppearanceElement(node) {
        node.style.width = node.offsetWidth.toString().concat('px');
        node.style.position = 'absolute';
        this.#setAbsolutePosition();
        node.style.zIndex = '100';
    }

    /**
     * Set initial styles to the element
     * @param node {HTMLElement}
     */
    #setInitialStyles(node) {
        node.style.position = 'initial';
        node.style.width = 'initial';
        node.style.top = 'initial';
        node.style.left = 'initial';
    }

    #highlightClass = 'kanban-table__move-task';

    #highlightDropPlace = () => {
        this.#locationBelowCursor.classList.add(this.#highlightClass);
    };

    #removeHighlightDropPlace = () => {
        if (this.#currentDropLocation.classList.contains(this.#highlightClass)) {
            this.#currentDropLocation.classList.remove(this.#highlightClass);
        }
    };
}
