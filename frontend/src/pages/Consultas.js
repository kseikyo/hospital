import React, { Component } from 'react';
import './Consultas.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

class ConsultasPage extends Component {
    state = {
        creating: false,
        cancelando: false,
        consultas: [],
        medicos: []
    };

    constructor(props) { 
        super(props);
        this.titleElRef = React.createRef();
        this.medicoElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchConsultas();
        this.fetchMedicos();
    }

    static contextType = AuthContext;

    startCreateConsultaHandler = () => {
        this.setState({creating: true});
    };

    startCancelConsultaHandler = () => {
        this.setState({cancelando: true});
    };

    modalCancelarConsulta = () => {
        this.setState({cancelando: false});
        const title = this.titleElRef.current.value;
        const medico = this.findMedico(this.medicoElRef.current.value);
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const price = this
        .findMedico(this.medicoElRef.current.value)
        .consultas[this.findMedico(this.medicoElRef.current.value)]
        .price;
        
        if (
            title.trim().length === 0 || 
            date.trim().length === 0 ||
            description.trim().length === 0)
        {
            return;
        }

        const consulta = {title, medico, price, date, description};

        console.log(consulta);
        const requestBody = {
            query: `
                mutation {
                    cancelarConsulta(consultaInput: {title: "${title}", description: "${description}", medico: "${medico}", price:"${price}" date: "${date}"}) {
                        _id
                        title
                        description
                        date
                        creator {
                            _id
                            nome
                        }
                        medico {
                            nome
                        }
                    }
                }
            `
            };
        
        const token = this.context.token;
        

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Authentication failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData.data);
        })
        .catch(err =>{
            console.log(err);
        });

    }

    modalConfirmHandler = () => {
        
        this.setState({creating: false});      
        const title = this.titleElRef.current.value;
        const medico = this.findMedico(this.medicoElRef.current.value);
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const price = ''+Math.floor(Math.random()*(600-351)+350);
        if (
            title.trim().length === 0 || 
            date.trim().length === 0 ||
            description.trim().length === 0)
        {
            return;
        }

        const consulta = {title, medico, price, date, description};

        console.log(consulta);
        const requestBody = {
            query: `
                mutation {
                    createConsulta(consultaInput: {title: "${title}", description: "${description}", medico: "${medico}", price:"${price}" date: "${date}"}) {
                        _id
                        title
                        description
                        date
                        creator {
                            _id
                            nome
                        }
                        medico {
                            nome
                        }
                    }
                }
            `
            };
        
        const token = this.context.token;
        

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Authentication failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData.data);
            this.fetchConsultas();
        })
        .catch(err =>{
            console.log(err);
        });
    };

    modalCancelHandler = () => {
        this.setState({creating: false});
    };

    findMedico(nome) {
        let len = this.state.medicos.length;
        for(let i = 0; i < len; i++){
            if(this.state.medicos[i].nome === nome) {
                return ''+this.state.medicos[i]._id;
            }
        }
    }

    fetchConsultas() {
        
        const userId = this.context.clienteId;
        const requestBody = {
            query: `
                query {
                    userConsultas(userId: "${userId}"){
                        _id
                        title
                        description
                        date
                        creator {
                            _id
                            nome
                        }
                        medico {
                            _id
                            nome
                        }
                    }
                }
            `
            };
        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Authentication failed');
            }
            return res.json();
        })
        .then(resData => {
            const consultas = resData.data.consultas;
            console.log(resData);
            this.setState({consultas: consultas});
        })
        .catch(err =>{
            console.log(err);
        });
    };

    fetchMedicos() {
        const requestBody = {
            query: `
                query {
                    medicos{
                        _id
                        nome
                    }
                }
            `
            };
        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Authentication failed');
            }
            return res.json();
        })
        .then(resData => {
            const medicos = resData.data.medicos;
            this.setState({medicos: medicos});
        })
        .catch(err =>{
            console.log(err);
        });
    }

    render() {
        let consultasList;
        let medicosList;
        if(this.state.consultas) {
            consultasList = this.state.consultas.map(consulta => {
                return <li key={consulta._id} className="consultas__list-item">{consulta.title}</li>;
            });
        }
        if(this.state.medicos) {
            medicosList = this.state.medicos.map(medico => {
                return <option key={medico._id} value={medico.nome} ref={this.medicoElRef}>{medico.nome}</option>
            });
        }
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating && 
                <Modal 
                    title='Add Consulta' 
                    canCancel canConfirm 
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.modalConfirmHandler}
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Informações sobre a consulta</label>
                            <input type="text" id="title" ref={this.titleElRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="medico">Medicos disponíveis</label>
                            <select id="medico">
                                {medicosList}
                            </select>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea  id="description" rows="4" ref={this.descriptionElRef}></textarea>
                        </div>
                    </form>
                </Modal>}
                {this.context.token && <div className="consultas-control">
                    <p>Agende sua consulta!</p>
                    <button className="btn" onClick={this.startCreateConsultaHandler}>Criar consulta</button>
                </div>}
                <ul className="consultas__list">
                    {consultasList}
                </ul>
            </React.Fragment>
        );
    }
}

export default ConsultasPage;