import { navigate as routerNavigate } from "@reach/router";
import { hrefFactory } from "./hrefFactory";

export interface Navigate {
  toHome(): Promise<void>;
  toAuth(): Promise<void>;
}

export const navigate: Navigate = {
  toHome: (): Promise<void> => routerNavigate(hrefFactory.toHome()),
  toAuth: (): Promise<void> => routerNavigate(hrefFactory.toAuth()),
};
