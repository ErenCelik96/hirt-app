import React from 'react'
import Navbar from '../components/Navbar';
import FormPage from '../components/FormPage';
import Dashboard from '../components/Dashboard';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const AuthUser = ({ user }) => {
    return (
        <Router>
            <div>
                <Navbar user={user} />
                <div>
                    <Switch>
                        <Route exact path="/dashboard">
                            <Dashboard user={user} />
                        </Route>
                        <Route path="/">
                            <FormPage />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}

export default AuthUser
