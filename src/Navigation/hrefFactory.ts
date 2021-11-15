export class HrefFactory {
  toHome(): string {
    return `/`;
  }
  toAuth(): string {
    return "/authorization";
  }
}

export const hrefFactory = new HrefFactory();
