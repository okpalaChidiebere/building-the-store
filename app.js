"use strict"

/*
the store has the following information:

- the state tree
- provide an API or a way to get the state tree
- a way to listen and respond to the state changing
- a way to update the state
*/


function createStore () {

  let state  //this variable will hold the state of our entire application

  const getState = () => state //the arrow function is responsible for returning the state of our app. Remember arror function are expressions

  //When the user inovoke the createStore function they get an object back
  //In order to access the internal state of our store they can ivoke the getState method
  return {
    getState
  }
}


