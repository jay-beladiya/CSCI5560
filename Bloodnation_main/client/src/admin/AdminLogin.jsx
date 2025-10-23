import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AdminLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      let adminStatus = sessionStorage.getItem("admin");

      if (adminStatus) {
        navigate('/panel');
      } else {
        return;
      }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          const result = await fetch('http://localhost:3000/admin/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          })
          const resultJSON = await result.json();
          const data = resultJSON.response;

          if(data == true) {
            sessionStorage.setItem("admin", data);
            navigate('/panel');
          } else if(data == false) {
            alert("Unauthorized access, go back to home page immediately!");
          }
        } catch (error) {
          console.log("Fetch Error: ", error);
        } finally {
          setLoading(false);
        }
    }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-blue-200/30">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className=' h-screen flex justify-center items-center bg-black/90'>
            <h1 className=' absolute top-20 font-extrabold font-sans text-4xl text-white'>Admin Panel</h1>
            <div className=' flex justify-center items-center h-1/2 w-1/3 bg-blend-darken bg-blue-950 rounded-2xl backdrop-saturate-150 backdrop-blur-md shadow-lg'>
                <form onSubmit={handleLogin} className=' flex flex-col justify-around h-4/5 w-2/3'>
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' className=' p-2 rounded-2xl bg-white' />
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='p-2 rounded-2xl bg-white'/>
                    <button type='submit' className='w-30 h-10 self-center rounded-2xl bg-white font-bold hover:shadow-xl hover:cursor-pointer hover:bg-green-300'>Login</button>
                </form>
            </div>
        </section>
    </>
  )
}

export default AdminLogin
