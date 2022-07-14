import {Action} from "./action";

export interface GameHistory {
  playersNicknames: string[]
  gameDate: string
  actions: Action[]
}
