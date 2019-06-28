import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';
class AuthPage extends Component {
    state = {
        isLogin: true,
        isMedico: false
    }

    static contextType = AuthContext;
    
    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.nomeEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    switchMedHandler = () => {
        this.setState(prevState => {
            return {isMedico: !prevState.isMedico};
        });
    }

    submitHandler = (consulta) => {
        consulta.preventDefault();
        
        let nome;
        const email = this.emailEl.current.value;
        if(!this.state.isLogin) {
            nome  = this.nomeEl.current.value;
        }
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}"){
                        clienteId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if (!this.state.isLogin && !this.state.isMedico){
            requestBody = {
            query: `
                mutation {
                    createCliente(clienteInput: {email: "${email}", nome:"${nome}" password: "${password}"}) {
                        _id
                        email
                    }
                }
            `
            };
        }
        if (!this.state.isLogin && this.state.isMedico){
            requestBody = {
            query: `
                mutation {
                    createMedico(medicoInput: {email: "${email}", nome:"${nome}" password: "${password}"}) {
                        _id
                        email
                    }
                }
            `
            };
        }
        

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Authentication failed');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.data.login.token) {
                this.context.login(
                    resData.data.login.token, resData.data.login.clienteId, resData.data.login.tokenExpiration
                );

            }
        })
        .catch(err =>{
            console.log(err);
        });
    }

    render() {
        return (
        <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" ref={this.emailEl}></input>
            </div>
            {!this.state.isLogin && 
            <div className="form-control">
                <label htmlFor="Nome">Nome</label>
                <input type="text" id="nome" ref={this.nomeEl}></input>
            </div>} 
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl}></input>
            </div>
            
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={this.switchModeHandler}>Go to
                 {this.state.isLogin ? ' Signup': ' Login'}</button>
                 {this.state.isLogin && <button type="button" onClick={this.switchMedHandler}>Go to
                 {this.state.isMedico ? ' Médico': ' Cliente'}</button>}
            </div>
            
        </form>
        );
    }
}

export default AuthPage;