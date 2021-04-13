import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

export const appCode = `
import React, { useEffect, useRef, useState } from 'react';

function App() {
   return (
      <div className='h-screen flex flex-col bg-gray-900 text-gray-300  items-center '>

      </div>
   );
}

export default App;

`;
export default function Code({
   code,
   language
}: {
   code: string;
   language: string;
}) {
   useEffect(() => {
      Prism.highlightAll();
   }, []);
   return (
      <div className='w-full'>
         <pre className=' rounded-xl'>
            <code className={`language-${language} `}>{code}</code>
         </pre>
      </div>
   );
}
