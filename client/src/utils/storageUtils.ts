export const setValue = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getValue = <T = unknown>(key: string): T | null => {
  try {
    const savedValue = window.localStorage.getItem(key);

    if (!savedValue) {
      throw new Error();
    }

    return JSON.parse(savedValue);
  } catch {
    return null;
  }
};
