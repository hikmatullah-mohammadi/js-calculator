$(document).ready(function() {
  const display = $('#display')
  let currentDisplay = '0';
  
  // trigger events
  $('.btn-numbers').on('click', insertNumbers)
  $('.btn-operation').on('click', insertOperation)
  $('#equals').on('click', getTheResult)
  $('#clear').on('click', clearDisplay)
  $('#decimal').on('click', insertDecimal)
  $('#zero').on('click', insertZero)
  
  // ---------- Functions/Event handlers declaration
  function findIndexOfLastOperation (currentDisplay) {
    let lastIndex=0;
    for (let i of '+−×÷'){
      let ind = currentDisplay.lastIndexOf(i)
      if (lastIndex < ind) lastIndex = ind
    }
    return lastIndex
  }
  function isDisplayEndingWithOperator (currentDisplay) {
    return '+−×÷'.includes(currentDisplay.slice(-1))
  }

  // invoked when clear button is clicked
  function clearDisplay() {
    currentDisplay = '0'
    display.animate({'font-size': '0'}, 10)
    display.animate({'font-size': '35px'}, 200)
    display.text(currentDisplay)
  }
  // invoked when any number button is clicked
  function insertNumbers() {
    if (currentDisplay === '0') {
      currentDisplay = $(this).text()
    } else {
      currentDisplay += $(this).text()
    }
    display.text(currentDisplay)
  }

  // invoked when the ZERO( 0 ) button is clicked
  function insertZero() {
    if (currentDisplay.length === 1 && currentDisplay !== '0'){
      currentDisplay += '0'
    } else if (currentDisplay.slice(-1) === '0'){
      if (!isDisplayEndingWithOperator(currentDisplay.slice(0, -1))){
        currentDisplay += '0'
      }
    } else {
      currentDisplay += '0'
    }
    display.text(currentDisplay)
  }

  // invoked when the decimal (.) button is clicked
  function insertDecimal() {
    if (!currentDisplay.slice(findIndexOfLastOperation(currentDisplay)).includes('.')){
      if(isDisplayEndingWithOperator(currentDisplay)) {
      currentDisplay += '0.' 
      }else {
        currentDisplay += '.'
      }
      display.text(currentDisplay)
    }
  }
  // invoked when any operator(+-*/) button is clicked
  function insertOperation() {
    if(currentDisplay !== '0'){
      if (currentDisplay.endsWith('.')){
        currentDisplay += '0'
      }
      display.css('font-size', '1px')
      display.animate({'font-size': '35px'}, 100)
      currentDisplay += $(this).text()
      display.text(currentDisplay)
    }
  }
  // invoked when the equals button is pressed
  function getTheResult() {
    const parseEntry = currentDisplay => {
      let operators = []
      let operands = []
      
      // separate entered operators from numbers 45.78
      operators = currentDisplay.split(/[0-9]+\.?[0-9]*/).filter(item => item !== '')
      
      // separate entered operands from operators
      operands = currentDisplay.split(/[+−×÷]+/).filter(item => item !== '')
      
      // parse operators chains, so the last operation is performed
      // 2+*4 = 2*4, BUT: 7+*-5 = 7*-5
      operators = operators.map(item => (
          (item[item.length-1] ==='−' && item.length > 1) ?
          item.slice(item.length-2) :
          item[item.length-1]
        )
      )
      
      // combine operands with operators
      let combinedResult = ''
      for (let i=0; i<operands.length; i++){
        combinedResult += operands[i]
        if (i < operators.length){
          combinedResult += operators[i]
        }
      }
      
      // change [−×÷] to [-*/]
      let parsedResult = ''
      for (let i of combinedResult){
        if (i==='−')
          parsedResult += '-'
        else if (i==='×')
          parsedResult += '*'
        else if (i==='÷')
          parsedResult += '/'
        else
          parsedResult += i
      }
      return parsedResult.replace('--', '+')
      // end of parseEntry function
    }
    console.log(parseEntry(currentDisplay))
    let finalResult;
    try {
      finalResult = eval(parseEntry(currentDisplay))
    } catch(err){
      alert('BAD INPUT!!!')
      return
    }

    // Round off 0.4234344 = 0.4234
    let decimalPart = finalResult.toString().split('.')[1]
    if (decimalPart && decimalPart.length >= 5){
      finalResult = finalResult.toFixed(4)
    }
    
    display.css('font-size', '1px')
    display.animate({'font-size': '50px'}, 250)
    display.animate({'font-size': '35px'}, 250)
    currentDisplay = finalResult.toString()
    display.text(finalResult)
  }
})
