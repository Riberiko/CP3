"use strict";

(function(){

  //Global Variables

  window.addEventListener('load', init)

  function init()
  {
    const spanMin = myModule.gen('span')
    spanMin.id = 'timerMin'
    const spanSec = myModule.gen('span')
    spanSec.id = 'timerSec'
    const spanDiv = myModule.gen('span')
    spanSec.innerText = spanMin.innerText = '00'
    spanDiv.innerText = ':'

    myModule.id('timer').appendChild(spanMin)
    myModule.id('timer').appendChild(spanDiv)
    myModule.id('timer').appendChild(spanSec)

    const stop = myModule.gen('input')
    stop.type = 'button'
    stop.value = 'Stop'
    stop.addEventListener('click', myModule.stopTimer)

    const start = myModule.gen('input')
    start.type = 'button'
    start.value = 'Start'
    start.addEventListener('click', myModule.startTimer)

    const restart = myModule.gen('input')
    restart.type = 'button'
    restart.value = 'Restart'
    restart.addEventListener('click', myModule.restartTimer)

    myModule.id('timerCtl').appendChild(stop)
    myModule.id('timerCtl').appendChild(start)
    myModule.id('timerCtl').appendChild(restart)
    
    myModule.startTimer()
  }


})()
