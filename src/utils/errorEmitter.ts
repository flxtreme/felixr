type ErrorHandler = (error: Error) => void;

let handler: ErrorHandler | null = null;

const errorEmitter = {
  register: (fn: ErrorHandler) => { handler = fn; },
  unregister: () => { handler = null; },
  emit: (error: Error) => { handler?.(error); },
};

export default errorEmitter;