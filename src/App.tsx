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
   Action,
   PayloadAction
} from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

export const counterSlice = createSlice({
   name: 'counter',
   initialState: {
      value: 0
   },
   reducers: {
      increment: (state, { payload }: PayloadAction<number>) => {
         state.value += payload;
      },
      decrement: (state) => {
         state.value -= 1;
      },
      incrementByAmount: (state, action) => {
         state.value += action.payload;
      }
   }
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
//Generate Reducer
const counterReducer = counterSlice.reducer;

const store = configureStore({
   reducer: {
      counter: counterReducer
   }
});
import { ThunkAction } from 'redux-thunk';

type RootState = ReturnType<typeof store.getState>;
type AppThunk = ThunkAction<void, RootState, unknown, Action>;
type AppDispatch = typeof store.dispatch;
//or
const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
const authSelector = (state: RootState) => state.counter.value;
const login = (): AppThunk => async (dispatch) => {
   try {
      dispatch(increment(2));
      //   const currentUser = getCurrentUserFromAPI('https://auth-end-point.com/login')
      //   dispatch(setAuthSuccess(currentUser))
   } catch (error) {
      //   dispatch(setAuthFailed(error))
   } finally {
      //   dispatch(setLoading(false))
   }
};
const FilterCom = () => {
   const count = useSelector(authSelector);
   const dispatch = useAppDispatch();
   return (
      <div className='w-full overflow-y-auto flex justify-center items-center'>
         <div className='w-1/2'>
            <button
               className='p-2 bg-gray-200 text-gray-700 m-10 focus:outline-none rounded'
               onClick={() => dispatch(increment(2))}>
               Increment
            </button>
            <span>{count}</span>
            <button
               className='p-2 bg-gray-200 text-gray-700 m-10 focus:outline-none rounded'
               onClick={() => dispatch(decrement())}>
               Decrement
            </button>
         </div>
      </div>
   );
};

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
                        <FilterCom />
                     </Route>
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

export default App;
