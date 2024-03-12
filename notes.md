-gamboard object
    xcells

-players objects
    xsigns
    xmoves
    xrounds wins
    xgame winner


-game logic object
    xset win conditions
    xset players signs
    xget players moves as input
    xcheck move valid
    xadd player move
    xcheck win condition
    xdecide round winner/tie
    xgame winner = 3 round wins
    xreset


-DOM displaying object
    xrender players names
    Xrender players scores
    Xrendering player turns
    xrender round number

    xrender board
    xrender moves taken
    xrender tie
    xrender winning effect
    xrender errors

    xrender scores
        xplayerOne
        xplayerTwo,CPU

    xrestartRound btn
    xnext rounds
    xswitching turns

    xrestartGame btn
    -go to menu btn






# Hints:

    -You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself.


    -Once you have a working console game, create an object that will handle the display/DOM logic. Write a function that will render the contents of the gameboard array to the webpage (for now, you can always just fill the gameboard array with "X"s and "O"s just to see what’s going on).


    -Write the functions that allow players to add marks to a specific spot on the board by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker). Don’t forget the logic that keeps players from playing in spots that are already taken!


    -Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end!