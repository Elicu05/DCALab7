import { Task } from '../services/task-service';
import { TaskService } from '../services/task-service';
import { TareaItem } from './tarea-item';

export class TareasContainer extends HTMLElement {
    private taskService: TaskService;
    private tasks: Task[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.taskService = new TaskService();
    }

    async connectedCallback() {
        await this.loadTasks();
        this.render();
        // Listen for task-added event at document level
        document.addEventListener('task-added', this.handleTaskAdded.bind(this));
    }

    disconnectedCallback() {
        // Clean up event listener
        document.removeEventListener('task-added', this.handleTaskAdded.bind(this));
    }

    private async loadTasks() {
        this.tasks = await this.taskService.getTasks();
    }

    private async handleTaskAdded() {
        await this.loadTasks();
        this.render();
    }

    private async handleToggle(event: CustomEvent<{ index: number; completed: boolean }>) {
        const { index, completed } = event.detail;
        await this.taskService.toggleTask(index, completed);
        await this.loadTasks();
        this.render();
    }

    private async handleDelete(event: CustomEvent<{ index: number }>) {
        const { index } = event.detail;
        await this.taskService.deleteTask(index);
        await this.loadTasks();
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 1200px;
                    margin: 2rem auto;
                    padding: 0 2rem;
                    background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%);
                    border-radius: 24px;
                }
                .tareas-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 2.5rem;
                    padding: 2rem 1rem;
                }
                .empty-state {
                    text-align: center;
                    color: #FF69B4;
                    padding: 2rem;
                    background: #FFF0F5;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    border: 2px dashed #FFB6C1;
                    grid-column: 1 / -1;
                }
                todo-item {
                    display: block;
                    height: 100%;
                    /* El fondo y sombra ahora lo maneja el propio todo-item */
                    background: transparent;
                    box-shadow: none;
                    border: none;
                }
                todo-item:hover {
                    box-shadow: none;
                    border: none;
                }
            </style>
            <div class="tareas-container">
                ${this.tasks.length === 0 
                    ? '<div class="empty-state">🌟 No hay tareas pendientes 🌟</div>'
                    : this.tasks.map((task, index) => `
                        <todo-item 
                            data-title="${task.title}"
                            data-completed="${task.completed}"
                            data-index="${index}">
                        </todo-item>
                    `).join('')}
            </div>
        `;

        // Initialize todo items
        const todoItems = this.shadowRoot.querySelectorAll('todo-item');
        todoItems.forEach((item) => {
            const todoItem = item as TareaItem;
            todoItem.addEventListener('toggle', (e: Event) => {
                const customEvent = e as CustomEvent<{ index: number; completed: boolean }>;
                this.handleToggle(customEvent);
            });
            todoItem.addEventListener('delete', (e: Event) => {
                const customEvent = e as CustomEvent<{ index: number }>;
                this.handleDelete(customEvent);
            });
        });
    }
}

customElements.define('tareas-container', TareasContainer); 