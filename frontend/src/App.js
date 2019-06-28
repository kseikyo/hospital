import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import ConsultasPage from './pages/Consultas';
import AgendasPage from './pages/Agendas';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {

  state = {
    token: null,
    clienteId: null,
  };

  login = (token, clienteId, tokenExpiration) => {
    this.setState({token: token, clienteId: clienteId});
  }
  
  logout = () => {
    this.setState({token: null, clienteId: null});
  }
  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{
              token: this.state.token,
              clienteId: this.state.clienteId,
              login: this.login,
              logout: this.logout
            }}>
            <MainNavigation />
              <main className="main-content">
                  <Switch>
                    {this.state.token  && <Redirect from="/" to="/consultas" exact/>}
                    {this.state.token  && <Redirect from="/auth" to="/consultas" exact/>}

                    {!this.state.token &&
                      <Route path="/auth" component={AuthPage} />
                      }
                    <Route path="/consultas" component={ConsultasPage} />
                    {this.state.token &&
                      <Route path="/agenda" component={AgendasPage} />
                    }
                    {!this.state.token && <Redirect to="/auth" exact/>}
                  </Switch>
              </main>
            </AuthContext.Provider>
            </React.Fragment>
      </BrowserRouter> 
    );
  };
}

export default App;
