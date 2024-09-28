import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slice/authSlice";


function Login() {

  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { status, error, user } = useSelector(state => state.auth);
  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate(); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    // setIsLoading(true);
    // setError("");


    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");
    const role = formData.get("role");

    // console.log("From Login page",username,  password, role);
    


    try{
      const res = await dispatch(login({username, password, role})).unwrap();
      console.log(res);
      console.log("user",user);
      updateUser(res);
      navigate("/");

      
      // navigate("/login");

    }catch(err){

    }
  }


  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <div className="item">
            <select name="role">     
              <option value="" disabled="disabled" selected="selected">Select Enrollment Type</option>   
              <option value="agent">Agent</option>
              <option value="customer">Customer</option>
            </select>
          </div> 
          <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logining...' : 'Login'}
          </button>
          {status==="failed" && <span>{error.message}</span>}
          <Link to="/register">Don't you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
