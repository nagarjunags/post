/* Subscriber interface */
export interface Subscriber {
  update: (publisher: Publisher) => void;
}
export type ModelStatus = "pending" | "available" | "failure";
/** publisher interface **/
export interface Publisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
  updateSubscribers: () => void;
}

export class ActualPublisher implements Publisher {
  public subscribers: Subscriber[] = [];
  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  updateSubscribers(): void {
    this.subscribers.forEach((sub) => sub.update(this));
  }
  public modelStatus: ModelStatus = "pending";

  setModelStatus(modelStatus: ModelStatus): void {
    this.modelStatus = modelStatus;
  }

  getModelStatus() {
    return this.modelStatus;
  }
}
