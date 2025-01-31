export function useShadow(element: HTMLElement, html: string) {
  const shadowRoot = element.attachShadow({ mode: "open" });
  shadowRoot.innerHTML = html.trim();
  return shadowRoot;
}
