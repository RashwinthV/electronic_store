import React, {  useState } from 'react'
import loginIcons from '../../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import login from '../../Authorize/Auth';


const Login=() => {
    const [showPassword,setShowPassword] = useState(false)
    const [data,setData] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();  
        
        try {
            const response = await login(data.email, data.password)|| await fetch(`${process.env.REACT_APP_BACKEND_URL}/signin`)
            const getuser= await fetch(`${process.env.REACT_APP_BACKEND_URL}/save`)
            if(getuser){
                console.log("data retrivedsuccessfully");
                
            }
            else{
                console.log("data retrive Failed~")
            }
            if (response) {
                localStorage.setItem("email", data.email);
                toast.success("login successfull!")
                navigate('/');
            }
            else{
                toast.error("username or password is invalid")
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    const handleSocialLogin = (provider) => {
        const backendSocialLoginUrl = `${process.env.REACT_APP_IMAGE_URL}/login/${provider}`;
        window.location.href = backendSocialLoginUrl; 
      };
        
  return (
    <section id='login'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons'/>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='email' 
                                    placeholder='enter email' 
                                    name='email'
                                    value={data.email}
                                    required={true}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>

                        <div>
                            <label>Password : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='enter password'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>
                                <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash/>
                                            )
                                            :
                                            (
                                                <FaEye/>
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                Forgot password ?
                            </Link>
                        </div>

                        <button onClick={handleSubmit} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[300px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>
            <div className="social-login flex flex-wrap">
                <button
className='border border-red-600 hover:text-white bg-transparent hover:bg-red-600 flex justify-evenly px-2 py-4 w-full max-w-[150px] rounded md:rounded-lg hover:scale-110 transition-all mx-auto block mt-6'
onClick={() => handleSocialLogin("google")}
                >
                  Google{" "}
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="google-logo"
                  />
                </button>
                <button
className='border border-red-600 hover:text-white bg-transparent hover:bg-red-600 flex justify-evenly px-2 py-4 w-full max-w-[150px] rounded md:rounded-lg hover:scale-110 transition-all mx-auto block mt-6'
onClick={() => handleSocialLogin("facebook")}
                >
                  Facebook{" "}
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/color/48/facebook-new.png"
                    alt="facebook-new"
                  />
                </button>
               
              </div>
                    </form>

                    <p className='my-5'>Don't have account ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline'>Sign up</Link></p>
            </div>


        </div>
    </section>
  )
}

export default Login