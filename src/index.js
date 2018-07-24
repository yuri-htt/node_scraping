import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class App extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        items: []
      }
    }
    
      componentWillMount () {
          this.loadLogs()
      }
  
      render () {
          const itemsHtml = this.state.items.map(e => (
          <li key={e._id}>{e.name} - {e.body}</li>
          ))
          return (
          <div style={styles.background}>
              <LoginForm onPost={e => this.loadLogs()} />
              <ul>{itemsHtml}</ul>
          </div>
          )
      }
  
      // APIにアクセスしてDBのデータを読み取る
      loadLogs () {
          request
          .get('/api/getItems')
          .end((err, data) => {
            if (err) {
              console.error(err)
              return
            }
            this.setState({items: data.body.logs})
          })
      }
  }

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
                GET DATA A
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
        console.log('getPolatData')
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
    background: {
        height: 1000,
        MozBackground: "-moz-linear-gradient(rgba(22,44,135,0.9),rgba(25,10,47,0.9))",
        OBackground: "-o-linear-gradient(rgba(22,44,135,0.9),rgba(25,10,47,0.9))",
        msBackground: "-ms-linear-gradient(rgba(22,44,135,0.9),rgba(25,10,47,0.9))",
        background: "linear-gradient(rgba(22,44,135,0.9),rgba(25,10,47,0.9))",
        backgroundColor: "#fef4f4", 
        margin: 0,
        padding: 0
    },
    form : {
        width: 500,
    },
    login: {
        padding: 16,
        justifyContent: 'center',
        backgroundColor: 'green'
    },
    textField: {
        color: 'white',
    },
    right: {
        textAlign: 'right'
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'))
