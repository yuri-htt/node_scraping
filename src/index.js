import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
import  LoginForm  from './loginForm'
import Charts from './charts'

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

    // APIにアクセスしてDBのデータを読み取る
    loadLogs () {
        request
        .get('/api/getItems')
        .end((err, data) => {
        if (err) {
            console.log(err)
            return
        }

        this.setState({items: data.body.logs[0].polarDatas})
        })
    }

    render () {
        return (
        <div style={styles.scene}>
            <LoginForm onPost={e => this.loadLogs()} />
            <div style={styles.chartsContainer}>
                {this.state.items.length !== 0 &&
                    <Charts polarData={this.state.items} />
                }
            </div>
        </div>
        )
    }
}


const styles = {
    scene: {
        height: 1000,
        margin: 0,
        padding: 0,
    },
    chartsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
    },
}

ReactDOM.render(
  <App />,
  document.getElementById('root'))