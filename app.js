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
  /*
  This variable will store the list of functions for everytime the user invokes createStore.subscribe
  This is necessasy so that when we change the state of our state tree, we will need to call every every function that was passed in when the function on was invoked
  in a loop
   */
  let listeners = [] 

  const getState = () => state //the arrow function is responsible for returning the state of our app. Remember arror function are expressions

  /**This method takses in  */
  const subscribe = (listener) => {
    listeners.push(listener) //we push into our listeners array the function being passed to subecirbe when it is invoked
    
    //returning this function gives the user a way to unsubscribe from the store when this return function is invoked
    //all the user has to do is assign the ivoked subscribe function to a variable; then the variable will be a function the can ivoke to unsubscribe
    return () => {
      listeners = listeners.filter((l) => l !== listener) //we filter our the original function that was passed in, when subscibe was invoked
    }
  }

  //When the user inovoke the createStore function they get an object back
  //In order to access the internal state of our store they can ivoke the getState method
  return {
    getState,
    subscribe
  }
}


/**
 * Below are example code on how to use the
 * createStore function above
 */


const store = createStore()

//The user can inovke a subcribe method and pass a call back function. This callbackfunction when invoked by the user,
//will listen for changes in the state tree as well as the user can do anything they want in this call back function
store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

//The user can subcribe more than one time
const unSubscribe = store.subscribe(() => {
  console.log('The store is created')
})

unSubscribe()




