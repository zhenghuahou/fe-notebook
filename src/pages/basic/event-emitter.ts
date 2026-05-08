type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string | symbol, EventHandler[]> = new Map();

  /**
   * 订阅事件
   * @param event 事件名，支持 string 或 symbol
   * @param handler 事件处理函数
   */
  on(event: string | symbol, handler: EventHandler): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
    return this;
  }

  /**
   * 发布事件
   * @param event 事件名
   * @param args 传递给事件处理函数的参数
   */
  emit(event: string | symbol, ...args: any[]): this {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
    return this;
  }

  /**
   * 取消订阅
   * @param event 事件名
   * @param handler 可选，指定要移除的事件处理函数。如果不提供，移除该事件的所有处理函数
   */
  off(event: string | symbol, handler?: EventHandler): this {
    if (!handler) {
      this.events.delete(event);
    } else {
      const handlers = this.events.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
        if (handlers.length === 0) {
          this.events.delete(event);
        }
      }
    }
    return this;
  }

  /**
   * 订阅一次性事件
   * @param event 事件名
   * @param handler 事件处理函数
   */
  once(event: string | symbol, handler: EventHandler): this {
    const onceHandler: EventHandler = (...args) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }

  /**
   * 移除所有事件监听
   */
  clear(): void {
    this.events.clear();
  }
}

// 使用示例
const emitter = new EventEmitter();

// 1. 使用字符串作为事件名
const handler1 = (data: string) => {
  console.log('Handler 1:', data);
};

const handler2 = (data: string) => {
  console.log('Handler 2:', data);
};

emitter.on('message', handler1);
emitter.on('message', handler2);
emitter.emit('message', 'Hello World');

// 2. 使用 Symbol 作为事件名（实现私有事件）
const PRIVATE_EVENT = Symbol('private');

emitter.on(PRIVATE_EVENT, (data: number) => {
  console.log('Private event handler:', data);
});

emitter.emit(PRIVATE_EVENT, 42);

// 3. once 的使用
emitter.once('init', () => {
  console.log('Init event (will only trigger once)');
});

emitter.emit('init'); // 会触发
emitter.emit('init'); // 不会触发

// 4. off 的使用
emitter.off('message', handler1); // 只移除 handler1
emitter.emit('message', 'After removing handler1');

export { EventEmitter };
