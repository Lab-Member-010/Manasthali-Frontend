// import React from 'react';
// // import SignUp from './components/Signup';
// import SignIn from './components/Signin';



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
       
//         {/* <SignUp/> */}
//         <SignIn/>
      
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin";

import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
// import SignUp from "./components/Signup";

const App = () => {
  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  
  );
};

export default App;

