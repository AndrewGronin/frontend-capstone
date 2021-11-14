import { navigate as routerNavigate } from "@reach/router";

export class HrefFactory {
  toHome(): string {
    return `/`;
  }
}

export const hrefFactory = new HrefFactory();

export interface Navigate {
  toHome(): Promise<void>;
}

export const navigate: Navigate = {
  toHome: (): Promise<void> => routerNavigate(hrefFactory.toHome()),
};
