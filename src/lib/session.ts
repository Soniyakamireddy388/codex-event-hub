const KEY = "coderush_email";

export function saveEmail(email: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, email);
}
export function loadEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}
export function clearEmail() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
