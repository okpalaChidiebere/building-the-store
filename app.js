"use strict"

/*
the store has the following information:

- the state tree
- provide an API or a way to get the state tree
- a way to listen and respond to the state changing
- a way to update the state
*/

//Library Code: In real Redux app, you will have an npm library that will do all this implementations below for you. So dont have to necessarily do this yourself
//All you have to do is, pass to the library your reducer(App code) that is a pure function! and it will efficiently update the 
//state tree for you
function createStore (reducer) {

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

  const dispatch = (action) => {
    state = reducer(state, action)
    //Loop through all the listeners so that all the React Components that subscribe to this store can effectively update their UI 
    listeners.forEach((listener) => listener())
  }

  //When the user inovoke the createStore function they get an object back
  //In order to access the internal state of our store they can ivoke the getState method
  return {
    getState,
    subscribe,
    dispatch
  }
}

/** Everything below here is your App code */

const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'


/*
Instead of hard coding all of the action object into the dispatch and location, we make a function whose jobis to 
return us the Redux action object so we dont necessarily have to rememebr that the type name everytime
These functions are called Action Creators
 */
function addTodoAction (todo) {
  return {
    type: ADD_TODO,
    todo,
  }
}

function removeTodoAction (id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleTodoAction (id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction (goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction (id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}
/** End Action Creators */


/**
 * Below are example code on how to use the
 * createStore function above
 */
//Though each reducer handles a different slice of state, we must combine reducers into a single reducer to pass to the store
//We have a root reducer function that returns a state tree with all the data it has
//The argument 'state = {}' initialize the state to an empty object if the state tree is undefined yet
// The argument 'action' will update either the todos or goals depending on the action type. 
function app (state = {}, action) {
  return {
    todos: todos(state.todos, action), //the todo reducer function will update the todo slice of the state tree
    goals: goals(state.goals, action), //the goals reducer function will update the goals slide of the state tree
  }
}


/*
We pass this main or root reducer to the createStore()
*/
const store = createStore(app) //you pass to the library your reducer. So that it will effectively know how to update the state tree

//The user can inovke a subcribe method and pass a call back function. This callbackfunction when invoked by the user,
//will listen for changes in the state tree as well as the user can do anything they want in this call back function
store.subscribe(() => {
  //console.log('The new state is: ', store.getState())
  const { goals, todos } = store.getState()

  /* We have to reset the UI so that it will not print duplicate of state.
  Because what happens is whenever the state updates, it loops through all the todos and goals then print them agian afreash
  */
  document.getElementById('goals').innerHTML = ''
  document.getElementById('todos').innerHTML = ''
  /*End reseting the UI */

  goals.forEach(addGoalToDOM)
  todos.forEach(addTodoToDOM)
})

//The user can subcribe more than one time
const unSubscribe = store.subscribe(() => {
  console.log('The store is created')
})

// unSubscribe() if you want the component to unsubscribe from the store


// App Code: This will be your App code in real Redux app
//This code is a reducer method that explains how the state will change based on the action that occurs in the application
//Reducer function MUST be a pure function
function todos (state = [], action) {
  switch(action.type) {
    case ADD_TODO :
      return state.concat([action.todo])
    case REMOVE_TODO :
      return state.filter((todo) => todo.id !== action.id)
    /*
    For TOOGLE_TODO this is a bit tricky. The goal is when the TOGGLE_TODO action is dispatched, we want to update the complete property on whatever todo is is passed along in tha ction payload
    We still want to keep our reducer function as a Pure function. So our algorithm was we map through the todos state, and if
    there is no matching todo we just return the back the todo input to the user without the modified change. ELSE if there is a matching todo
    we invoke object.assign(), pass to it am empty object (a new object), we pass to it what we want to merge to the empty object which is the todo object in our case, 
    then finally pass to it any updates we want to make to the merged object(which is complete propert we want to update)
    REMEMBER, the reason, we did not modify the todo payload input directly, because it will fail one of the rule of a pure function which is
    Pure functions do not produce side effects like I/O operations
    */
    case 'TOGGLE_TODO' :
      return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete })) //we used Object.assign() to return a new object with merged properties
    default :
      return state
  }
}

/*
This new reducer function will mamange another state for goals
Reducers are typically named after the slices of state they manage
FYI the code 'state = []' means we assign an empty array when the goals state is not yet defined
*/
function goals (state = [], action) {
  switch(action.type) {
    case ADD_GOAL :
      return state.concat([action.goal])
    case REMOVE_GOAL :
      return state.filter((goal) => goal.id !== action.id)
    default :
      return state
  }
}

/*Whenever, you want to update the state, you  call the dispatch and pass the action object
and the createStore will know how to update the state because of the reduer function
Updates to the store can only be triggered by dispatching actions*/
/*store.dispatch(addTodoAction({
    id: 0,
    name: 'Learn Redux',
    complete: false
}))

store.dispatch(addTodoAction({
    id: 1,
    name: 'Wash the car',
    complete: false,
}))

store.dispatch(addTodoAction({
    id: 2,
    name: 'Go to the gym',
    complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
    id: 0,
    name: 'Learn Redux'
}))

store.dispatch(addGoalAction({
    id: 1,
    name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0))*/



/*
Pure functions must
- Return the same result if the same arguments are passed in
- Depend solely on the arguments passed into them
- Do not produce side effects, such as API requests and I/O operations
Eg of Pure functions
const square = x => x * x;
const double = array => {
    let doubledArray = [];
    array.forEach(n => doubledArray.push(n * 2));
    return doubledArray;
};

eg of not pure functions

const sumAndPrint = (a, b) => {
    const sum = a = b;
    console.log(sum)
    return suml
};

Date.now()

Math.random()
 */

function generateId () {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36); //return a unique id
}


/*
This method will extract the information from the input field, reset the input field, and then dispatch an addTodoAction 
Action Creator with the text that the user typed into the input field.

So we're using the UI to change the state of our store
*/
function addTodo () {

  const input = document.getElementById('todo')
  const name = input.value
  input.value = '' //reset the input value to be empty by default

  store.dispatch(addTodoAction({
    name,
    complete: false,
    id: generateId()
  }))
}

/*
This method will extract the information from the input field, reset the input field, and then dispatch an addGoalAction 
Action Creator with the text that the user typed into the input field.

So we're using the UI to change the state of our store
*/
function addGoal () {

  const input = document.getElementById('goal')
  const name = input.value
  input.value = ''  //reset the input value to be empty by default

  store.dispatch(addGoalAction({
    id: generateId(),
    name,
  }))
}


document.getElementById('todoBtn').addEventListener('click', addTodo)

document.getElementById('goalBtn').addEventListener('click', addGoal)


/* This button will be used to remove a todo or goal item from the the state of our store
 * REMEMBER: Our DOM is the representation of the state in our store and not the other way round
 onClick parameter will be a callback function that we will execute when this button is clicked. cool stuff right? ;)
 */
function createRemoveButton (onClick) {
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'X'
  removeBtn.addEventListener('click', onClick)
  return removeBtn
}

/*
 The changes are not reflecting the new state visually in the UI by just calling the dispatch. 
 But calling these functions inside the subecribe function will print the state of our dome in the UI
 REMEMBER: Our DOM is the representation of the state in our store and not the other way round
 */
function addTodoToDOM (todo) {
  const node = document.createElement('li')
  const text = document.createTextNode(todo.name)

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)
  node.style.textDecoration = todo.complete ? 'line-through' : 'none' //When a todo is completed(bool value which will be true), we want a line to appear through it on the list

  //Add an eventListener for when this item in the list is clicked, we mark it as complete
  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id)) //the result of this dispatch function will be rendered in the UI by the store.subscribe callback
  })

  document.getElementById('todos')
    .appendChild(node)
}

function addGoalToDOM (goal) {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.name)

  //we created a button, and the calback function(good thing about callback function is they are a function type just like int, string, etc. But his time its is an expression of a code we want to run) is what will be executed when the button is clicked
  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id))
  })

  node.appendChild(text)//append the text to the node
  node.appendChild(removeBtn) //append the removeButton

  document.getElementById('goals')
    .append(node)
}
