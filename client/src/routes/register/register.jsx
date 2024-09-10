import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../slice/authSlice";

function Register() {

  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);


  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    // setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");

    console.log(username, email, password, role);
    


    try{
      // const res = await apiRequest.post("/auth/register", {
      //   username, email, password, role
      // });

      const res = await dispatch(register({username, email, password, role})).unwrap();
      

      // console.log(res);
      navigate("/login");

    }catch(err){
     
      // setError(err.response.data.message);
    // }finally{
    //   setIsLoading(false);
    // }
    }
  }

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />  
          <div className="item">
              {/* <label htmlFor="type">Enrolling as: </label> */}
              <select name="role">     
              <option value="" disabled="disabled" selected="selected">Select Enrollment Type</option>   
                <option value="agent">Agent</option>
                <option value="customer">Customer</option>
              </select>
            </div>     
          <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Registering...' : 'Register'}
            </button>
          {status==='failed' && <span>{error.message}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
