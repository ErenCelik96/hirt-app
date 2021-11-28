import React, {useState, useEffect} from 'react';
import './App.css';
import Login from './components/LoginPage';
import AuthUser from './router/AuthUser';
import { auth } from './firebase';


function App() {
  const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        })
    }, [])

  return (

    <div className="App">
      {
        user ? <AuthUser user={user} /> : <Login />
      }
    </div>

  );
}

export default App;
