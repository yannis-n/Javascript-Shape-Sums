import Menu from "../../src/helperScreens/menu.js";
import LoadingBar from "../../src/helperScreens/loadingBar.js";
import MenuBar from "../../src/helperScreens/menuBar.js";
import StartingGameCountDown from "../../src/helperScreens/startingGameCountDown.js";

export function createMenu(game, gameWidth, gameHeight){
        return new Menu(game, gameWidth, gameHeight)
}

export function createLoadingBar(game){
        return new LoadingBar(game)
}

export function createMenuBar(game){
        return new MenuBar(game)
}

export function createStartingGameCountDown(game){
        return new StartingGameCountDown(game)
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

      if (game.gamestate === GAMESTATE.PAUSED) {
        if (game.helperScreens.menu.hidden()){
              game.helperScreens.menu.pause()
        }

        // if (!game.helperScreens.menuBar.hidden()){
        //         game.helperScreens.menuBar.hide ()
        //   }
      }

      if (game.gamestate === GAMESTATE.RUNNING) {
        if (game.helperScreens.menuBar.hidden()){
              game.helperScreens.menuBar.show()
        }
      }
}

