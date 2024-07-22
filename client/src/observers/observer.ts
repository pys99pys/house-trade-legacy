type ObserverType = {
  action: "CHANGE_TRADE_LIST_PAGE";
  event: (page: number) => void;
};

type Params = { action: "CHANGE_TRADE_LIST_PAGE"; payload: number };

class Observer {
  #observers: ObserverType[] = [];

  public subscribe(observer: ObserverType) {
    this.#observers.push(observer);
  }

  public publish(params: Params) {
    this.#observers.forEach((observer) => {
      if (observer.action === params.action) {
        observer.event(params.payload);
      }
    });
  }
}

export default new Observer();
