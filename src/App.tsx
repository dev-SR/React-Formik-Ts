import React, { useEffect, useRef, useState } from 'react';
import {
   BrowserRouter as Router,
   Route,
   Link,
   useLocation,
   Switch
} from 'react-router-dom';
import Code, { appCode } from './syntaxHighligher/code';
import {
   configureStore,
   createSlice,
   createAsyncThunk
} from '@reduxjs/toolkit';
import {
   Provider,
   TypedUseSelectorHook,
   useDispatch,
   useSelector
} from 'react-redux';
export type TodoId = string;

export type Todo = {
   id: TodoId;
   title: string;
   completed: boolean;
};

type TodosState = {
   // In `status` we will watch
   // if todos are being loaded.
   status: 'loading' | 'idle';

   // `error` will contain an error message.
   error: string | null;
   list: Todo[];
};

const initialState = {
   list: [],
   error: null,
   status: 'idle'
} as TodosState;

/**
 * 

*/

// `createAsyncThunk` is a generic function.
// We can use the first type-parameter
// to tell what type will be returned as a result.
export const fetchTodos = createAsyncThunk<
   Todo[],
   number,
   { rejectValue: FetchTodosError }
>(
   'todos/fetch',

   // The second argument, `thunkApi`, is an object
   // that contains all those fields
   // and the `rejectWithValue` function:
   async (limit: number, thunkApi) => {
      const response = await fetch(
         `https://jsonplaceholder.typicode.com/todos?limit=${limit}`
      );

      //Handling Thunk Errors#
      // Check if status is not okay:
      if (response.status !== 200) {
         // Return the error message:
         return thunkApi.rejectWithValue({
            message: 'Failed to fetch todos.'
         });
      }
      const data: Todo[] = await response.json();
      return data;
   }
);
// This type describes the error object structure:
type FetchTodosError = {
   message: string;
};
export const todosSlice = createSlice({
   name: 'todos',
   initialState,
   reducers: {
      // ...
   },

   // In `extraReducers` we declare
   // all the actions:
   extraReducers: (builder) => {
      // When we send a request,
      // `fetchTodos.pending` is being fired:
      //type():"todos/fetch/pending"
      builder.addCase(fetchTodos.pending, (state) => {
         // At that moment,
         // we change status to `loading`
         // and clear all the previous errors:
         state.status = 'loading';
         state.error = null;
      });

      // When a server responses with the data,
      // `fetchTodos.fulfilled` is fired:
      //type():"todos/fetch/fulfilled"

      builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
         // We add all the new todos into the state
         // and change `status` back to `idle`:
         state.list.push(...payload);
         state.status = 'idle';
      });

      // When a server responses with an error:
      //type():"todos/fetch/rejected"
      builder.addCase(fetchTodos.rejected, (state, { payload }) => {
         // We show the error message
         // and change `status` back to `idle` again.
         if (payload) state.error = payload.message;
         state.status = 'idle';
      });
   }
});

/**
 * fetchTodos, the thunk action creator that kicks off the async payload callback you wrote
fetchTodos.pending, an action creator that dispatches an 'todos/fetch/pending' action
fetchTodos.fulfilled, an action creator that dispatches an 'todos/fetch/fulfilled' action
fetchTodos.rejected, an action creator that dispatches an 'todos/fetch/rejected' action
*/

export const todosReducer = todosSlice.reducer;

// Use `configureStore` function to create the store:
export const store = configureStore({
   reducer: {
      // Specify our reducer in the reducers object:
      todos: todosReducer
   }
});

// Define the `RootState` as the return type:
export type RootState = ReturnType<typeof store.getState>;
export const selectStatus = (state: RootState) => state.todos.status;
export const selectTodo = (state: RootState) => state.todos.list;
export const selectError = (state: RootState) => state.todos.error;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const LoadTodos = () => {
   const dispatch = useDispatch();

   const status = useTypedSelector(selectStatus);
   const todos = useTypedSelector(selectTodo);
   const error = useTypedSelector(selectError);

   // When clicked, dispatch `fetchTodos`:
   const handleClick = () => dispatch(fetchTodos(10));

   return (
      // Change the button text
      // depending on the current `status`:
      <div>
         <button type='button' onClick={handleClick}>
            {status === 'loading' ? 'Loading todos...' : 'Load todos'}
         </button>

         {todos && todos.map((n) => <h1>{n.title}</h1>)}
         {error && <h1>{error}</h1>}
      </div>
   );
};

// export const AddTodo = () => {
//    const [title, setTitle] = useState('');
//    const dispatch = useAppDispatch();

//    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       setTitle('');

//       dispatch(
//          addTodo({
//             id: Date.now().toString(),
//             completed: false,
//             title
//          })
//       );
//    };

//    return (
//       <form onSubmit={handleSubmit} className='flex flex-col space-y-4 '>
//          <input
//             type='text'
//             name='todoName'
//             className='text-black px-2 py-1 focus:outline-none'
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//          />
//          <button className='focus:outline-none bg-yellow-400 text-black py-2 rounded'>
//             Add Todo
//          </button>
//       </form>
//    );
// };

// export const TodoList = () => {
//    const dispatch = useAppDispatch();
//    // Now, use the selector inside right away,
//    // no need to destructure the result:
//    const todos = useTypedSelector(selectTodos);

//    // The rest of the code stays the same:
//    return (
//       <ul>
//          {todos.map((todo) => (
//             <li key={todo.id} className='flex items-center space-x-2'>
//                <input
//                   type='checkbox'
//                   checked={todo.completed}
//                   className='bg-gray-600'
//                   onChange={() => dispatch(toggleTodo(todo.id))}
//                />
//                <span>{todo.title}</span>
//             </li>
//          ))}
//       </ul>
//    );
// };

function App() {
   return (
      <div className='h-screen flex flex-col bg-gray-900 text-gray-300  items-center '>
         <Provider store={store}>
            <Router>
               <Nav />
               <div className='w-full flex-1 overflow-y-hidden flex flex-col'>
                  <Switch>
                     <Route path='/code' exact>
                        <div className='w-full overflow-y-auto flex justify-center'>
                           <div className='w-11/12 '>
                              <Code code={appCode} language='javascript' />
                           </div>
                        </div>
                     </Route>
                     <Route path='/' exact>
                        <div className='flex h-full w-full justify-center items-center flex-col'>
                           {/* <TodoList /> */}
                           <LoadTodos />
                        </div>
                     </Route>
                     <Route path='/todo' exact></Route>
                     <Route path='*' exact>
                        {() => (
                           <div className='h-full flex justify-center items-center'>
                              <h2 className=' text-gray-50'>PAGE NOT FOUND</h2>
                           </div>
                        )}
                     </Route>
                  </Switch>
               </div>
            </Router>
         </Provider>
      </div>
   );
}
const Nav = () => {
   const l = useLocation();

   return (
      <div className='flex w-full h-16 bg-gray-800 justify-center items-center'>
         <div className='flex ml-10 space-x-4'>
            <Link
               to='/code'
               className={`text-xl ${
                  l.pathname === '/code' ? 'border-b-2 border-blue-200' : ''
               }`}>
               Code
            </Link>

            <Link
               to='/'
               className={`text-xl ${
                  l.pathname === '/' ? 'border-b-2 border-blue-200' : ''
               }`}>
               Home
            </Link>
         </div>
      </div>
   );
};

export default App;
