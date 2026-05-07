type ToastType = 'success' | 'error' | 'cashback' | 'info';

interface ToastOptions {
  message: string;
  type: ToastType;
}

class ToastSystem {
  private container: HTMLDivElement | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      this.createContainer();
    }
  }

  private createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'ibc-toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 9999;
    `;
    document.body.appendChild(this.container);
  }

  public show({ message, type }: ToastOptions) {
    if (!this.container) this.createContainer();

    const toast = document.createElement('div');
    const styles: Record<ToastType, string> = {
      success: 'background: #1B5E35; border-left: 4px solid #C9A84C; color: white;',
      error: 'background: #DC3545; border-left: 4px solid #fff; color: white;',
      cashback: 'background: linear-gradient(135deg, #C9A84C, #F0C040); color: #1B5E35; animation: ibc-pulse 0.5s ease-in-out 2;',
      info: 'background: #154A2C; border-left: 4px solid #fff; color: white;'
    };

    const icons: Record<ToastType, string> = {
      success: '✓',
      error: '✗',
      cashback: '💰',
      info: 'ℹ'
    };

    toast.style.cssText = `
      ${styles[type]}
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 450px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform: translateX(100px);
      opacity: 0;
    `;

    toast.innerHTML = `
      <span style="font-size: 18px;">${icons[type]}</span>
      <span>${message}</span>
    `;

    if (type === 'cashback') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ibc-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    this.container?.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // Remove after 4s
    setTimeout(() => {
      toast.style.transform = 'translateX(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}

const ibcToastSystem = new ToastSystem();

// Expose to window as requested
if (typeof window !== 'undefined') {
  (window as any).ibcToast = {
    success: (msg: string) => ibcToastSystem.show({ message: msg, type: 'success' }),
    error: (msg: string) => ibcToastSystem.show({ message: msg, type: 'error' }),
    cashback: (msg: string) => ibcToastSystem.show({ message: msg, type: 'cashback' }),
    info: (msg: string) => ibcToastSystem.show({ message: msg, type: 'info' }),
  };
}

export const ibcToast = (window as any).ibcToast;
