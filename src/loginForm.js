import React from 'react'
import request from 'superagent'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            password: ''
        }
    }

    render () {
        return (
        <div style={styles.form}>
            <form style={styles.login} noValidate autoComplete="off">
                <TextField
                    id="id"
                    label="ID"
                    style={styles.textField}
                    value={this.state.id}
                    onChange={e => this.idChanged(e)}
                    margin="normal"
                />
                <br />
                <TextField
                    id="password-input"
                    label="Password"
                    type="password"
                    style={styles.textField}
                    value={this.state.password}
                    onChange={e => this.passwordChanged(e)}
                    autoComplete="current-password"
                    margin="normal"
                />
            </form>
            <Button variant="raised" color="primary" onClick={e => this.getPolatData()} style={styles.button}>
                GET DATA
            </Button>
        </div>
        )
    }

    idChanged(e) {
        this.setState({id: e.target.value})
    }

    passwordChanged(e) {
        this.setState({password: e.target.value})
    }

    getPolatData(e) {
        request
        .get('/api/getPolarData')
        .query({
            id: this.state.id,
            password: this.state.password,
        })
        .end((err, data) => {
            if (err) {
                console.error(err)
            }
            this.setState({id: '', password: ''})
        })
    }
}

const styles = {
    form : {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 30,
    },
    login: {
        padding: 16,
        justifyContent: 'center',
    },
    textField: {
        color: 'white',
    },
}

export default LoginForm;