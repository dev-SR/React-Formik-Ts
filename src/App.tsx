import React, { FC, useEffect, useRef, useState } from 'react';
import {
   BrowserRouter as Router,
   Route,
   Link,
   useLocation,
   Switch
} from 'react-router-dom';
import Code, { appCode } from './syntaxHighligher/code';
import {
   Formik,
   Field,
   Form,
   FormikHelpers,
   useField,
   FieldAttributes,
   useFormikContext
} from 'formik';
import * as Yup from 'yup';
interface Values {
   name: string;
   email: string;
   single_checkbox: boolean;
   group_checkbox: string[];
   select: string;
   radio: string;
   title: '';
}
const initialValues: Values = {
   name: '',
   email: '',
   single_checkbox: false,
   group_checkbox: [],
   radio: '',
   select: '',
   title: ''
};
const submitHandler = (
   values: Values,
   { setSubmitting, resetForm }: FormikHelpers<Values>
) => {
   setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      resetForm();
      setSubmitting(false);
   }, 300);
};

const validator = Yup.object({
   name: Yup.string().min(3, 'Must be at least 3 char').required('Required'),
   email: Yup.string().email('Invalid email address').required('Required'),
   single_checkbox: Yup.boolean()
      .oneOf([true], 'You must accept')
      .required('Required'),
   select: Yup.string()
      .oneOf(['red', 'green', 'blue', 'todo', 'posts'])
      .required('Required'),
   group_checkbox: Yup.array()
      .min(1, "You can't leave this blank.")
      .required("You can't leave this blank.")
      .nullable(),
   radio: Yup.string()
      .oneOf(['student', 'teacher'], 'You must accept')
      .required('Required')
});

type MyTextInputProps = {
   label?: string;
} & FieldAttributes<{}>;

const MyTextInput: React.FC<MyTextInputProps> = ({ label, ...props }) => {
   // Props -> GenericFieldHTMLAttributes & FieldConfig<T>
   const [field, meta] = useField(props);
   // useField('firstName')=>returns all
   // the data for fistName fields
   return (
      <>
         {label && (
            <label
               className='text-yellow-100 text-xs'
               htmlFor={props.id || props.name}>
               {label}
            </label>
         )}
         <Field
            {...field}
            {...props}
            className='px-2 py-1 focus:outline-none w-full'
         />
         {meta.touched && meta.error && (
            <div className='text-red-400 text-xs'>{meta.error}</div>
         )}
      </>
   );
};

const MySelect: React.FC<MyTextInputProps> = ({ label, ...props }) => {
   const [field, meta] = useField(props);
   return (
      <div className='text-black w-full flex flex-col'>
         {label && (
            <label
               className='text-yellow-100 text-xs'
               htmlFor={props.id || props.name}>
               {label}
            </label>
         )}
         <Field
            as='select'
            {...field}
            {...props}
            className='px-2 py-1 focus:outline-none'
         />
         {meta.touched && meta.error && (
            <div className='text-red-400 text-xs'>{meta.error}</div>
         )}
      </div>
   );
};
const SingleCheckBox: FC<FieldAttributes<{}>> = ({ children, ...props }) => {
   const [field, meta] = useField(props);
   // console.log(field);
   return (
      <>
         {
            <label className='text-yellow-100 text-xs flex items-center space-x-2'>
               <Field
                  type='checkbox'
                  {...field}
                  {...props}
                  checked={field.value}
               />
               <div className='text-gray-100'>{children}</div>
            </label>
         }
         {meta.touched && meta.error && (
            <div className='text-red-400 text-xs'>{meta.error}</div>
         )}
      </>
   );
};

const GroupCheckBox: FC<FieldAttributes<{}>> = ({ children, ...props }) => {
   const [field, meta] = useField(props);
   // console.log(field);
   return (
      <>
         {
            <label className='text-yellow-100 text-xs flex items-center space-x-2'>
               <Field type='checkbox' {...field} {...props} />
               <div className='text-gray-100'>{children}</div>
            </label>
         }
         {meta.touched && meta.error && (
            <div className='text-red-400 text-xs'>{meta.error}</div>
         )}
      </>
   );
};

const RadioBox: FC<FieldAttributes<{}>> = ({ children, ...props }) => {
   const [field, meta] = useField(props);
   return (
      <>
         {
            <label className='text-yellow-100 text-xs flex items-center space-x-2'>
               <Field type='radio' {...field} {...props} />
               <div className='text-gray-100'>{children}</div>
            </label>
         }
         {meta.touched && meta.error && (
            <div className='text-red-400 text-xs'>{meta.error}</div>
         )}
      </>
   );
};
const Basic: React.FC<{}> = () => {
   return (
      <Formik
         initialValues={initialValues}
         onSubmit={submitHandler}
         validationSchema={validator}>
         {({ isSubmitting, values, errors }) => (
            <Form className='flex w-1/3 flex-col space-y-1 ' autoComplete='off'>
               <MyTextInput
                  name='name'
                  label='Name'
                  type='text'
                  placeholder='Frank'
                  id='name'
               />
               <MyTextInput
                  name='email'
                  label='Email'
                  type='email'
                  placeholder='frack@gmail.com'
               />
               <MySelect label='Select' name='select'>
                  <option value=''>select fav colors</option>
                  <option value='red'>red</option>
                  <option value='green'>green</option>
                  <option value='blue'>blue</option>
               </MySelect>
               <SingleCheckBox name='single_checkbox'>I agree</SingleCheckBox>
               <div className='text-yellow-100'>Group CheckBok:</div>
               <div role='group'>
                  <GroupCheckBox name='group_checkbox' value='facebook'>
                     Facebook
                  </GroupCheckBox>
                  <GroupCheckBox name='group_checkbox' value='youtube'>
                     Youtube
                  </GroupCheckBox>
                  <GroupCheckBox name='group_checkbox' value='insta'>
                     Instagram
                  </GroupCheckBox>
               </div>

               <div role='group'>
                  <div className='text-yellow-100'>Radio</div>
                  <RadioBox name='radio' value='student'>
                     Student
                  </RadioBox>
                  <RadioBox name='radio' value='teacher'>
                     Teacher
                  </RadioBox>
               </div>

               <button
                  type='submit'
                  className='bg-yellow-500 py-1 rounded w-full text-white focus:outline-none disabled:opacity-50'
                  disabled={
                     isSubmitting || errors.name
                        ? true
                        : false || errors.email
                        ? true
                        : false
                  }>
                  {isSubmitting ? 'Loading...' : 'Submit'}
               </button>
               <pre className='font-mono text-gray-200'>
                  {JSON.stringify(values, null, 2)}
               </pre>
            </Form>
         )}
      </Formik>
   );
};

//enableReinitialize ==TRUE

const ReInitialize: FC<{}> = () => {
   const [input, setInput] = useState(initialValues);
   useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/todos/1')
         .then((response) => response.json())
         .then((json) => {
            // console.log(json);
            setInput({
               ...input,
               title: json.title
            });
         });
   }, []);
   return (
      <Formik enableReinitialize initialValues={input} onSubmit={submitHandler}>
         {(props) => (
            <Form className='text-black w-1/3'>
               <MyTextInput
                  name='title'
                  label='Populated from https://jsonplaceholder.typicode.com using "enableReinitialize" props'
               />
               <pre className='font-mono text-gray-200'>
                  {JSON.stringify({ title: props.values.title }, null, 2)}
               </pre>
            </Form>
         )}
      </Formik>
   );
};

//useFormikContext()

/**
 * A custom React Hook that returns Formik states and helpers via React Context. Thus, this hook will only work if there is a parent Formik React Context from which it can pull from.
 * * If called without a parent context (i.e. a descendent of a <Formik> component or withFormik higher-order component), you will get a warning in your console.

*/
const InnerForm = () => {
   const { values, handleChange } = useFormikContext<Values>();
   const [fetchState, setFetchState] = useState();
   // React.useEffect(() => {
   //    console.log(values);
   // }, [values]);

   const MyhandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      let op = e.target.value;
      switch (op) {
         case 'todo':
            fetch('https://jsonplaceholder.typicode.com/todos/1')
               .then((response) => response.json())
               .then((json) => {
                  setFetchState(json);
               });
         case 'posts':
            fetch('https://jsonplaceholder.typicode.com/posts/1')
               .then((response) => response.json())
               .then((json) => {
                  setFetchState(json);
               });
      }
      //Update Selected Value
      handleChange(e);
   };
   return (
      <div>
         <MySelect
            id='select'
            name='select'
            // value={values}
            onChange={MyhandleChange}>
            <option value=''>Select</option>
            <option value='todo'>FETCH TODO</option>
            <option value='posts'>FETCH POSTS</option>
         </MySelect>
         <pre>{JSON.stringify(values.select, null, 2)}</pre>

         <div className=' overflow-x-auto'>
            <pre>{JSON.stringify(fetchState, null, 2)}</pre>
         </div>
      </div>
   );
};

const UseFormikContext = () => (
   <Formik
      initialValues={initialValues}
      onSubmit={submitHandler}
      validationSchema={validator}>
      <Form className='w-1/3 flex flex-col overflow-x-hidden'>
         <InnerForm />
      </Form>
   </Formik>
);

function App() {
   return (
      <Router>
         <div className='w-full flex bg-gray-900 text-gray-300 h-full  items-center flex-col'>
            <Nav />
            <Switch>
               <Route path='/code' exact>
                  <div className='w-full overflow-y-auto flex justify-center'>
                     <div className='w-11/12 '>
                        <Code code={appCode} language='javascript' />
                     </div>
                  </div>
               </Route>
               <Route path='/' exact>
                  <UseFormikContext />
                  <ReInitialize />
                  <Basic />
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
   );
}
const Nav = () => {
   const l = useLocation();

   return (
      <div className='flex w-full h-10 bg-gray-800 justify-center items-center mb-1'>
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
