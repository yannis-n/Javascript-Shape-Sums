import Menu from "../src/menu.js";
import LoadingBar from "./loadingBar.js";

export function createMenu(game, gameWidth, gameHeight){
        return new Menu(game, gameWidth, gameHeight)
}

export function createLoadingBar(game){
        return new LoadingBar(game)
}