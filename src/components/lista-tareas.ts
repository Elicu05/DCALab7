import { TaskService } from '../services/task-service';

export class ListaTareas extends HTMLElement {
    private taskService: TaskService;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.taskService = new TaskService();
    }

    async connectedCallback() {
        this.render();
    }

    private async handleAdd(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        const title = input.value.trim();

        if (title) {
            await this.taskService.addTask(title);
            input.value = '';
            // Dispatch an event to notify tareas-container to refresh
            document.dispatchEvent(new CustomEvent('task-added'));
        }
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 0 2rem;
                    font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                .container {
                    background: #FFE4E1;
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(255, 182, 193, 0.3);
                    padding: 2rem;
                    transition: all 0.3s ease;
                    border: 3px solid #FFB6C1;
                }
                .container:hover {
                    background: #FFF0F5;
                    transform: translateY(-2px);
                }
                h1 {
                    color: #FF69B4;
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 2rem;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    text-shadow: 2px 2px 4px rgba(255, 182, 193, 0.3);
                }
                .todo-form {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    position: relative;
                }
                input[type="text"] {
                    flex-grow: 1;
                    padding: 1rem 1.5rem;
                    border: 2px solid #FFB6C1;
                    border-radius: 25px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: #FFFFFF;
                    color: #FF69B4;
                }
                input[type="text"]::placeholder {
                    color: #FFB6C1;
                }
                input[type="text"]:focus {
                    outline: none;
                    background: #FFFFFF;
                    box-shadow: 0 0 0 3px #FFC0CB;
                    border-color: #FF69B4;
                }
                button {
                    padding: 1rem 2rem;
                    background: #FFC0CB;
                    color: #FFFFFF;
                    border: 2px solid #FFB6C1;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 8px rgba(255, 182, 193, 0.3);
                }
                button:hover {
                    background: #FFB6C1;
                    transform: scale(1.04);
                    box-shadow: 0 6px 12px rgba(255, 182, 193, 0.4);
                }
                button:active {
                    transform: scale(0.98);
                    box-shadow: 0 2px 4px rgba(255, 182, 193, 0.3);
                }
                .add-icon {
                    width: 20px;
                    height: 20px;
                    stroke: currentColor;
                    stroke-width: 2;
                    fill: none;
                }
            </style>
            <div class="container">
                <h1>✨ My Tasks ✨</h1>
                <form class="todo-form">
                    <input type="text" placeholder="🌸 What needs to be done? 🌸" required>
                    <button type="submit">
                        <svg class="add-icon" viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Task
                    </button>
                </form>
            </div>
        `;

        // Add event listeners to the form
        const form = this.shadowRoot.querySelector('form');
        form?.addEventListener('submit', this.handleAdd.bind(this));
    }
}

customElements.define('todo-list', ListaTareas); 