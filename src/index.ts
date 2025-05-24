import { app as firebaseApp } from './Firebase/firebase-config';
import { AppRoot } from './components/app-root';
import { TodoList } from './components/todo-list';
import { TodoItem } from './components/todo-item';
import { LoginForm } from './components/login-form';
import { AuthService } from './services/auth-service';

// Define custom elements
customElements.define('app-root', AppRoot);
customElements.define('todo-list', TodoList);
customElements.define('todo-item', TodoItem);
customElements.define('login-form', LoginForm);

// Initialize app
const app = new AppRoot();
document.body.appendChild(app);

// Register custom elements
customElements.define('app-root', class extends HTMLElement {
    private authService: AuthService;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.authService = new AuthService();
    }

    connectedCallback() {
        this.render();
        this.setupAuthListener();
    }

    private setupAuthListener() {
        this.authService.onAuthStateChanged((user) => {
            this.render();
        });
    }

    private async handleSignOut() {
        try {
            await this.authService.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    render() {
        if (!this.shadowRoot) return;

        const user = this.authService.getCurrentUser();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%);
                    font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    position: relative;
                    overflow-x: hidden;
                }
                :host::before {
                    content: '🌸';
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    font-size: 24px;
                    opacity: 0.3;
                    animation: float 3s ease-in-out infinite;
                }
                :host::after {
                    content: '✨';
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    font-size: 24px;
                    opacity: 0.3;
                    animation: float 3s ease-in-out infinite reverse;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .header {
                    background: rgba(255, 182, 193, 0.9);
                    padding: 1rem 2rem;
                    box-shadow: 0 4px 15px rgba(255, 182, 193, 0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    border-bottom: 3px solid #FFC0CB;
                    backdrop-filter: blur(5px);
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: #FF69B4;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                .user-info::before {
                    content: '👤';
                    font-size: 1.2rem;
                }
                .sign-out-btn {
                    padding: 0.75rem 1.5rem;
                    background: #FFC0CB;
                    color: #FFFFFF;
                    border: 2px solid #FFB6C1;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 8px rgba(255, 182, 193, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .sign-out-btn::before {
                    content: '🚪';
                    font-size: 1.1rem;
                }
                .sign-out-btn:hover {
                    background: #FFB6C1;
                    transform: scale(1.04);
                    box-shadow: 0 6px 12px rgba(255, 182, 193, 0.4);
                }
                .sign-out-btn:active {
                    transform: scale(0.98);
                    box-shadow: 0 2px 4px rgba(255, 182, 193, 0.3);
                }
            </style>
            ${user ? `
                <div class="header">
                    <div class="user-info">
                        <span>${user.displayName || 'User'}</span>
                    </div>
                    <button class="sign-out-btn" id="signOutBtn">Sign Out</button>
                </div>
                <todo-list></todo-list>
            ` : `
                <login-form></login-form>
            `}
        `;

        // Add event listener for sign out button
        const signOutBtn = this.shadowRoot.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.handleSignOut());
        }
    }
});