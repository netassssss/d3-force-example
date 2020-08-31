import NeuralConnection from './NeuralConnection';

class NeuralManager {
  constructor() {
    this.instances = new Map();
  }

  get(ref, funcName) {
    if (!funcName) throw new Error('Please add function name to the manager!');
    if (ref) return this.instances.get(ref)[funcName]();
    return null;
  }

  set(instance) {
    if (!this.instances.get(instance)) this.instances.set(instance, new NeuralConnection());
  }
}

export default new NeuralManager();
