const eventManager = {
  list: new Map(),

  on(event, callback, listenerId) {
    callback.listenerId = listenerId;
    this.list.has(event) || this.list.set(event, []);
    this.list.get(event).push(callback);
    return this;
  },

  off(event, listenerId) {
    if (listenerId) {
      this.list.has(event) || this.list.set(event, []);
      let callbacks = this.list.get(event);
      this.list.set(event, callbacks.filter(c => c.listenerId !== listenerId));
    } else {
      this.list.delete(event);
    }
    return this;
  },

  /**
   * Enqueue the event at the end of the call stack
   * Doing so let the user call toast as follow:
   * toast('1')
   * toast('2')
   * toast('3')
   * Without setTimemout the code above will not work
   */
  emit(event, ...args) {
    this.list.has(event) &&
      this.list.get(event).forEach(callback =>
        setTimeout(() => {
          callback(...args);
        }, 0)
      );
  }
};

export default eventManager;
