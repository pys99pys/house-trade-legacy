interface EventPayload {
  action: "add" | "remove" | "select";
  cityCode: string;
}

class sigunguCodeObserver {
  #observers: { from: string; event: (payload: EventPayload) => void }[] = [];

  public regist(from: string, event: (payload: EventPayload) => void): void {
    this.#observers.push({ from, event });
  }

  public notify(from: string, payload: EventPayload): void {
    this.#observers.forEach((observer) => {
      if (from !== observer.from) {
        observer.event(payload);
      }
    });
  }
}

export default new sigunguCodeObserver();
