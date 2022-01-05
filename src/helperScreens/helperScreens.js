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
  
        // this is where it is assumed that the loading bar load immediately once the page loads
        if (game.gamestate === GAMESTATE.LOADING){
                // Once the bar is loaded hide and update gamestate
                if (game.helperScreens.loadingBar.loaded()){
                        game.helperScreens.loadingBar.hide()
                        game.updateGameState(GAMESTATE.MENU)       
                }
        }

        // both of this check whether the game is paused or hasn't started yet. In both cases if the menu is hidden it should appear
        if (game.gamestate === GAMESTATE.MENU) {
                if (game.helperScreens.menu.hidden()){
                        game.helperScreens.menu.show()
                }
        }

        if (game.gamestate === GAMESTATE.PAUSED) {
                if (game.helperScreens.menu.hidden()){
                        game.helperScreens.menu.pause()
                }
        }


}

