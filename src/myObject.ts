type MyObjectState = {
  value: number;
  lastUpdated: Date;
  history: number[];
};

export class MyTimedObject {
  private state: MyObjectState;
  private timer: ReturnType<typeof setInterval>;

  constructor() {
    this.state = {
      value: 0,
      lastUpdated: new Date(),
      history: [],
    };

    // Update every second
    this.timer = setInterval(() => this.update(), 1000);
  }

  private update() {
    this.state = {
      value: this.state.value + Math.random() - 0.5, // Random walk
      lastUpdated: new Date(),
      history: [...this.state.history, this.state.value].slice(-10), // Keep last 10 values
    };
  }

  public getState(): MyObjectState {
    return this.state;
  }

  // Clean up timer when done
  public dispose() {
    clearInterval(this.timer);
  }
}

// Singleton instance (optional)
export const myObjectInstance = new MyTimedObject();