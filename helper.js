/**
 * Name : Riberiko Niyomwungere
 * Date : November 07, 2023
 *
 * This is the helper script, it returns all methods utilized by the other programs
 *
 **/

const myModule = (function (){

  /** ------------------------------ Global Variables ----------------------------  */
  let timer = 0, timerId
  const milisecToSec = 1000
  const secToMin = 60

  /** ------------------------------ Helper Functions ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Verifies the status for the response ensuring that it is ok
   * @param {Response} res - The response object
   *
   **/
  function statusCheck(res)
  {
    if(!res.ok) throw new Error(`HTTP Error Code ${res.status}`)
    return res.json()
  }

  /**
   * Name is alittle misleading this can be used just to write
   * messages to the screen
   *
   * @param {string} err - the text that you want to be printed
   *
   **/
  function handleError(err)
  {
    myModule.id('message').innerText = err + ' Please Make sure you have connection to the internet and refresh the page.'
  }

  /**
   * Stops the timer from running
   *
   **/
  function stopTimer()
  {
    clearInterval(timerId)
  }

  /**
   * Start the timer
   **/
  function startTimer()
  {
    clearInterval(timerId)
    timerId = setInterval(() => {
      timer++
      id('timerMin').innerText = Math.floor(timer/60)
      id('timerSec').innerText = timer%60

      id('timerMin').innerText = id('timerMin').innerText.padStart(2, '0')
      id('timerSec').innerText = id('timerSec').innerText.padStart(2, '0')
    }, milisecToSec)
  }

  /**
   * Restarts the timer by setting it to zero and then starting it.
   **/
  function restartTimer()
  {
    stopTimer()
    timer = 0
    id('timerSec').innerText = id('timerMin').innerText = '00'
    id('timerMin').innerText = id('timerMin').innerText.padStart(2, '0')
    id('timerSec').innerText = id('timerSec').innerText.padStart(2, '0')
    startTimer()
  }

  return{
    id: id,
    qs: qs,
    qsa: qsa,
    gen: gen,
    statusCheck: statusCheck,
    handleError: handleError,
    timer: timer,
    timerId: timerId,
    stopTimer: stopTimer,
    startTimer: startTimer,
    restartTimer: restartTimer
  }
})()
