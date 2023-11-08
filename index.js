/**
 * Name : Riberiko Niyomwungere
 * Date : November 07, 2023
 *
 * This is the main script for the sudoku it conatins many of the fucntions that make the website/app work
 */
"use strict";

(function() {

  const URL = 'https://sudoku-api.vercel.app/api/dosuku'
  let menuInputs, postSolve, preSolve, board = [], hintCount = 0, grids

  let stack = [], algId

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * init() initializes all the surface level buttons to have event listeners.
   * These buttons include start-btn and back-btn.
   */
  function init() {
    initialBoardSetup()
    requestNewboard()

    menuInputs = document.querySelectorAll('article nav input')

    menuInputs[0].addEventListener('click', () => {
      requestNewboard()
      loadNewBoard()
    })

    menuInputs[1].addEventListener('click', loadNewBoard)
    menuInputs[2].addEventListener('click', getHint)

    menuInputs[3].addEventListener('click', () => {
      updateBoard()

      let valid = true
      for(let i = 0; i < 9; i++) if(new Set(getRow(i)).size != 9 || new Set(getColumn(i)).size != 9)
      {
        valid = false
        break;
      }

      if(valid) for(let i = 0; i < 9; i+=3) for(let j = 0; j < 9; j+=3) if(new Set(getSquare(i, j)).size != 9)
      {
        valid = false
        break;
      }

      for(let row of board) if(row.includes(0))
      {
        valid = false
        break
      }

      myModule.id('isValid').innerText = valid
    })

    menuInputs[4].addEventListener('click', () => {
      updateBoard() 

      const open = getNextBlankInput(0, 0)
      //keeping track of the current working, what can still go here, and what we have already tried
      if(open) stack.push([open, getValidSet(open[0], open[1])])
      else console.log('no starting place found')

      //disabled all input
      myModule.qsa('input').forEach(inpt => inpt.disabled = true)

      myModule.restartTimer()
      myModule.stopTimer()
      algId = setInterval(() => {

        myModule.id('message').innerText = 'Solving: Still working on Problem'
        if(stack.length == 0)
        {
          clearTimeout(algId)
          myModule.id('message').innerText = 'Solving: No solution Found'
          myModule.stopTimer()
          return
        }

        const curr = stack[stack.length-1]
        if(curr[1].size == 0)
        {
          myModule.id('message').innerText = 'Solving: Dead End'
          setIntoBoard(curr[0][0], curr[0][1], '').classList.remove('green')
          stack.pop()
          myModule.stopTimer()
          myModule.id('isValid').innerText = false
          return
        }

        const valueToInsert = curr[1].values().next().value
        setIntoBoard(curr[0][0], curr[0][1], valueToInsert).classList.add('green')
        curr[1].delete(valueToInsert)

        const next = [getNextBlankInput(curr[0][0], curr[0][1])]
        if(!next[0])
        {
          myModule.id('message').innerText = 'Solving: Solved'
          clearTimeout(algId)
          myModule.qsa('input').forEach(inpt => inpt.disabled = false)
          myModule.qsa('#grid input').forEach(inpt => inpt.classList.add('green'))
          myModule.id('isValid').innerText = true
          return
        }

        next.push(getValidSet(next[0][0], next[0][1]))
        stack.push(next)

      }, 50) //This is the Interval that is responsible for the auto solve function, the heigher this number, the slower the process

    })
  }

  /**
   * Gives the end user a hint for the solution for the sudoku
   **/
  function getHint(e)
  {
    updateBoard()
    const pos = []

    for(let i = 0; i < 9; i++)
    {
      for(let j = 0; j < 9; j++) if(!board[i][j]) pos.push([j, i])
    }

    if(!pos.length)
    {
      e.target.disabled = true
      return
    }
    const choice = pos[Math.floor(Math.random()*pos.length)]

    setIntoBoard(choice[0], choice[1], postSolve[choice[1]][choice[0]]).disabled = true
    myModule.id('hint-count').innerText = ++hintCount
  }

  /**
   * Creates the board
   **/
  function initialBoardSetup()
  {
    const grid = myModule.id('grid')
    for(let sub = 0; sub < 9; sub++)
    {
      const subGrid = myModule.gen('div')

      for(let inp = 0; inp < 9; inp++)
      {
        const input = myModule.gen('input')
        input.type = 'number'
        input.setAttribute('min', '0')
        input.setAttribute('max', '9')
        input.classList.add('inputTextSize')
        input.addEventListener('keyup', validateInput)
        subGrid.appendChild(input)
      }

      grid.appendChild(subGrid)
    }
    grids = myModule.id('grid').querySelectorAll('div')
  }

  /**
   * Gets a new board from the api
   **/
  function requestNewboard()
  {
    myModule.id('hint-count').innerText = hintCount
    fetch(URL)
      .then(myModule.statusCheck)
      .then(data => {
        const boards = data.newboard.grids[0]

        myModule.id('dificulty').innerText = boards.difficulty
        preSolve = boards['value']
        postSolve = boards['solution']

        loadNewBoard()
      })
      .catch(myModule.handleError)
  }

  /**
   * Loads the solution from the api into the board on screen
   **/
  function loadNewBoard()
  {

    let y = 0, x = 0

    for(let c = 0; c < 9; c++)
    {
      const inputs = grids[c].querySelectorAll('input')
      let iTrack = 0
      if(x == 9)
      {
        x=0
        y+=3
      }
      for(let i = y; i < y+3; i++)
      {
        for(let j = x; j < x+3; j++)
        {
          inputs[iTrack].value = preSolve[i][j]
          if(inputs[iTrack].value != 0) inputs[iTrack].disabled = true
          else inputs[iTrack].disabled = false
          inputs[iTrack++].dispatchEvent(new KeyboardEvent('keyup'))
        }
      }
      x+=3
    }
    updateBoard()
    menuInputs[2].disabled = false
    myModule.qsa('#grid input').forEach(inpt => inpt.classList.remove('green'))
    myModule.id('isValid').innerText = false
    myModule.id('message').innerText = ''
    hintCount = 0
    myModule.id('hint-count').innerText = hintCount
  }

  /**
   * Puts a value into the board at the appropriate place
   *
   * @param {any} value - the value to be inserted into the board
   * @param {int} x - for the placemnet
   * @param {int} y - for the placemnet
   **/
  function setIntoBoard(x, y, value)
  {
    const findG = Math.floor(y/3)*3 + Math.floor(x/3)
    const findI = y%3*3 + x%3

    grids[findG].children[findI].value = value
    board[y][x] = value
    return grids[findG].children[findI]
  }

  /**
   * Updates be backend board so that it matches whateve the user has on their screen
   **/
  function updateBoard()
  {
    let y = 0, x = 0

    board = [[],[],[],[],[],[],[],[],[]]
    for(let c = 0; c < 9; c++)
    {
      const inputs = grids[c].querySelectorAll('input')
      let iTrack = 0

      if(x == 9)
      {
        x=0
        y+=3
      }
      for(let i = y; i < y+3; i++)
      {
        for(let j = x; j < x+3; j++)
        {
          board[i][j] = (isNaN(inputs[iTrack].value)) ? 0 : Number(inputs[iTrack].value)
          iTrack++
        }
      }
      x+=3
    }

  }

  /**
   * Ensure that the users input is actually what i expect it to be
   **/
  function validateInput(e)
  {
    if(this.value == 0 || isNaN(this.value)) this.value = ''
    else this.value = this.value[this.value.length-1] 
  }

  /** ---------------------------- Board Helper Functions ---------------------------- */

  /**
   * Gets the values in the columbn of the board
   *
   * @param {int} num - the columbn number to get
   **/
  function getColumn(num)
  {
    let toReturn = []
    for(let i = 0; i < 9; i++) toReturn.push(board[i][num])
    return toReturn
  }

  /**
   * Gets the values in the row of the board
   *
   * @param {int} num - the columbn number to get
   **/
  function getRow(num)
  {
    return board[num]
  }

  /**
   * Gets the values in the squre of the board
   *
   * @param {int} num - the squre number to get
   **/
  function getSquare(x, y)
  {
    let toReturn = []
    for(let i = y; i < y+3; i++)
    {
      for(let j = x; j < x+3; j++) toReturn.push(board[i][j])
    }
    return toReturn
  }

  /**
   * Gets the next blank in the board after the specified place
   *
   * @param {int} x - the x value
   * @param {int} y - the y value
   **/
  function getNextBlankInput(x, y)
  {
    for(let i = y; i < 9; i++)
    {
      for(let j = 0; j < 9; j++)
      {
        if(i == y && j < x) continue
        if(!board[i][j]) return [j,i]
      }
    }

    return null
  }

  /**
   * Gets all the valid numbers for specified point
   *
   * @param {int} x - the x value
   * @param {int} y - the y value
   **/
  function getValidSet(x, y)
  {
    const toReturn = new Set([1,2,3,4,5,6,7,8,9])
    const inRow = getRow(y)
    const inCol = getColumn(x)
    const inSquare = getSquare(Math.floor(x/3)*3, Math.floor(y/3)*3)

    for(let v of inRow) toReturn.delete(v)
    for(let v of inCol) toReturn.delete(v)
    for(let v of inSquare) toReturn.delete(v)
    return toReturn
  }

})();
