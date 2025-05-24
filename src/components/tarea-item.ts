import { Task } from '../services/task-service';
import { TaskService } from '../services/task-service';

export class TareaItem extends HTMLElement {
    private task!: Task;
    private index!: number;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('data-title');
        const completed = this.getAttribute('data-completed') === 'true';
        const index = parseInt(this.getAttribute('data-index') || '0');

        this.task = {
            title: title || '',
            completed
        };
        this.index = index;

        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: 100%;
                }
                .todo-item {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: stretch;
                    height: 100%;
                    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
                    background: #FFF7FA;
                    border-radius: 18px;
                    border: 1.5px solid #FFD6E3;
                    box-shadow: 0 4px 16px rgba(255, 182, 193, 0.10);
                    transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
                }
                .todo-item:hover {
                    box-shadow: 0 8px 24px rgba(255, 182, 193, 0.18);
                    border-color: #FFB6C1;
                    background: #FFF0F5;
                }
                .checkbox {
                    width: 22px;
                    height: 22px;
                    cursor: pointer;
                    accent-color: #FF69B4;
                    border-radius: 6px;
                    border: 1.5px solid #FFB6C1;
                    margin-bottom: 0.5rem;
                    align-self: flex-start;
                }
                .todo-text {
                    flex-grow: 1;
                    margin: 0.5rem 0 1.5rem 0;
                    font-size: 1.1rem;
                    color: #FF69B4;
                    text-decoration: ${this.task.completed ? 'line-through' : 'none'};
                    opacity: ${this.task.completed ? '0.5' : '1'};
                    font-weight: 600;
                    text-align: center;
                    word-break: break-word;
                    letter-spacing: 0.5px;
                }
                .todo-text::before {
                    content: '🌸';
                    margin-right: 0.5rem;
                    opacity: 0.7;
                }
                .delete-btn {
                    padding: 0.4rem;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    background: transparent;
                    color: #FFB6C1;
                    transition: background 0.2s, color 0.2s, transform 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    align-self: flex-end;
                }
                .delete-btn:hover {
                    background: #FFE4E1;
                    color: #FF69B4;
                    transform: scale(1.1);
                }
                .delete-icon {
                    width: 18px;
                    height: 18px;
                    stroke: currentColor;
                    stroke-width: 2;
                    fill: none;
                    transition: all 0.2s;
                }
            </style>
            <div class="todo-item" part="todo-item">
                <input type="checkbox" 
                       class="checkbox"
                       part="checkbox"
                       ${this.task.completed ? 'checked' : ''}>
                <span class="todo-text" part="todo-text">${this.task.title}</span>
                <button class="delete-btn" part="delete-btn" title="Delete task">
                    <svg class="delete-icon" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        // Add event listeners
        const checkbox = this.shadowRoot.querySelector('.checkbox');
        const deleteButton = this.shadowRoot.querySelector('.delete-btn');

        checkbox?.addEventListener('change', this.handleToggle.bind(this));
        deleteButton?.addEventListener('click', this.handleDelete.bind(this));
    }

    private handleToggle(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { index: this.index, completed: checkbox.checked }
        }));
    }

    private handleDelete() {
        this.dispatchEvent(new CustomEvent('delete', {
            detail: { index: this.index }
        }));
    }
}

customElements.define('todo-item', TareaItem); 