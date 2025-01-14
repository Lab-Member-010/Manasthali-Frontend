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

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signin from "./components/Signin";

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

// import React from "react";
// import { useSearchParams } from "react-router-dom";
// import Chat from "./components/Chat";

// function App() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const userId = searchParams.get("userId");

//   if (!token || !userId) {
//     return <p>Please provide token and userId as query parameters in the URL.</p>;
//   }

//   return (
//     <div>
//       <h1>Chat Application</h1>
//       <Chat user={{ _id: userId }} token={token} />
//     </div>
//   );
// }

// export default App;
