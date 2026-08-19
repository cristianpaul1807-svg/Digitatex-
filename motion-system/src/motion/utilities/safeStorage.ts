/**
 * Session storage that cannot take the page down.
 *
 * In a sandboxed iframe without `allow-same-origin` — which is how a chat
 * panel, an email preview, a CMS embed or a documentation viewer will render a
 * page — merely READING `window.sessionStorage` throws a SecurityError. The
 * document has an opaque origin and therefore no storage bucket at all.
 *
 * Thrown from inside a React effect that exception unmounts the tree, and the
 * visitor gets a black screen with nothing to explain it. That is exactly what
 * happened to this showcase the first time it was handed to somebody as a file.
 *
 * Storage is a convenience in this system — remembering that a loader has
 * already played — so nothing may depend on it being there.
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Sin almacenamiento se pierde el "ya lo vi", que es justo lo que
      // menos importa de toda la pagina.
    }
  },
};
