import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios'
const Register = () => {
  const [userData , setUserData] = useState({
    name:'',
    email:'',
    password:'',
    password2:''
  });

  const [error , setError] = useState('')
  const navigate = useNavigate()
  const changeInputHandler = (e) => {
      setUserData(prevState => {
        return {...prevState , [e.target.name] : e.target.value}
      })
  }
  const registerUser = async(e) => {
    e.preventDefault()
    setError('');
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/users/register`;
      console.log('API URL:', apiUrl); // Add this line
    const response = await axios.post(apiUrl, userData);
      const newUser = await response.data;
      console.log(response);
      if(!newUser){
        setError("Couldn't register error . Please try again")
      }
      navigate('/login')
    } catch (err) {
      setError(err.response.data.message)
    }
  } 

  return (
    <section className='register'>
    <div className='container'>
    <h2> SIGN UP</h2>
    <form className='form register__form' onSubmit={registerUser}>
    {error &&
    <p className='form__error-message'>{error}</p>}
    <input type='text' placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler}/>
    <input type='text' placeholder='email' name='email' value={userData.email} onChange={changeInputHandler}/>
    <input type='password' placeholder='password' name='password' value={userData.password} onChange={changeInputHandler}/>
    <input type='password' placeholder='confirm password' name='password2' value={userData.password2} onChange={changeInputHandler}/>
    <button type='submit' className='btn primary'>Register</button>
    </form>
    <small>Aready have an account ? <Link to="/login">Sign in</Link></small>
    </div>
    </section>
  )
}

export default Register
