import { useSelector } from "react-redux";

const Feed = () => {
  const user = useSelector((state) => state.user.user);  
  const successMessage = useSelector((state) => state.user.successMessage); 

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      {successMessage && <p>{successMessage}</p>}
      {/* Render other content based on user details */}
    </div>
  );
};

export default Feed;
