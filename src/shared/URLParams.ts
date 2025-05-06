export class URLParams {
  static get url(): URL {
    return new URL(window.location.href);
  }

  static get(key: string): string | null {
    return URLParams.url.searchParams.get(key);
  }

  static set(key: string, value: string): void {
    const url = URLParams.url;
    url.searchParams.set(key, value);
    history.pushState(null, "", url);
  }

  static delete(key: string): void {
    const url = URLParams.url;
    url.searchParams.delete(key);
    history.pushState(null, "", url);
  }
}
