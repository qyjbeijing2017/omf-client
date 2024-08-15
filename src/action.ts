export class OMFAction<T> {
  private _listeners: ((data: T) => void)[] = [];
  constructor() {}
  on(listener: (data: T) => void) {
    this._listeners.push(listener);
  }
  off(listener: (data: T) => void) {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
  emit(data: T) {
    this._listeners.forEach((l) => l(data));
  }
  invoke = this.emit;
  addListener = this.on;
  removeListener = this.off;
  trigger = this.emit;
  subscribe = this.on;
  unsubscribe = this.off;
}
