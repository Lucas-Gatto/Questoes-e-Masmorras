const listeners = new Set();

export const toast = {
  show(message, options = {}) {
    for (const cb of listeners) {
      try { cb({ message, options }); } catch (_) {}
    }
  },
  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }
};