export function persistForm(form: HTMLFormElement, localStorageKey: string) {
  form.addEventListener("change", () => {
    const formData = new FormData(form);
    const dataEntries = formData.entries();
    const dataDict = Object.fromEntries(dataEntries);
    localStorage.setItem(localStorageKey, JSON.stringify(dataDict));
  });
  // immediately load creds from local storage at the start
  handleCredsChange(JSON.parse(localStorage.getItem(localStorageKey) ?? "{}"));

  window.addEventListener("storage", (event) => {
    if (event.key === localStorageKey) {
      handleCredsChange(JSON.parse(event.newValue ?? "{}"));
    }
  });

  async function handleCredsChange(creds: Record<string, string>) {
    Object.entries(creds).forEach(([key, value]) => {
      const field = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      if (!field) return;
      field.value = value as string;
    });
  }
}
