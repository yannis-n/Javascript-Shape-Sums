import Menu from "../src/menu.js";
import LoadingBar from "./loadingBar.js";

export function createMenu(game, gameWidth, gameHeight){
        return new Menu(game, gameWidth, gameHeight)
}

export function createLoadingBar(game){
        return new LoadingBar(game)
}


export function updateGameStateForHelperScreens(game, GAMESTATE){
        
    if (game.gamestate === GAMESTATE.LOADING){

        if (game.helperScreens.loadingBar.loaded()){
          game.helperScreens.loadingBar.hide()
        //       if (game.helperScreens.loadingBar.hidden()){
                game.updateGameState(GAMESTATE.MENU)
                
        //       }     
        }
      }

      if (game.gamestate === GAMESTATE.MENU) {
        if (game.helperScreens.menu.hidden()){
                game.helperScreens.menu.show()
        }
      }
}

