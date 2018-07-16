import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
// import puppeteer from 'puppeteer'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import secret from '../secret';

class BBSForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            password: ''
        }
    }

    render () {
        return (
        <div style={styles.form}>
            <form style={styles.login} noValidate autoComplete="off">
                <TextField
                    id="name"
                    label="Name"
                    className="coloredText"
                    style={styles.textField}
                    value={this.state.userid}
                    onChange={e => changed('userid', e)}
                    margin="normal"
                />
                <br />
                <TextField
                    id="password-input"
                    label="Password"
                    type="password"
                    className={styles.textField}
                    style={styles.textField}
                    value={this.state.passwd}
                    onChange={e => changed('passwd', e)}
                    autoComplete="current-password"
                    margin="normal"
                />
            </form>
            <Button variant="raised" color="primary" onClick={e => this.post()} style={styles.button}>
                GET DATA
            </Button>
        </div>
        )
    }

    nameChanged(e) {
        this.setState({name: e.target.value})
    }

    bodyChanged(e) {
        this.setState({body: e.target.value})
    }

    post(e) {
        request
        .get('/api/write')
        .query({
            name: this.state.name,
            body: this.state.body
        })
        .end((err, data) => {
            if (err) {
            console.error(err)
            }
            this.setState({body: ''})
            if (this.props.onPost) {
            this.props.onPost()
            }
        })
    }
}

// メインコンポーネント
class BBSApp extends React.Component {
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
            <BBSForm onPost={e => this.loadLogs()} />
            <p style={styles.right}>
            <Button variant="raised" color="primary" onClick={e => this.getPolarData()} style={styles.button}>
                GET DATA
            </Button></p>
            <ul>{itemsHtml}</ul>
        </div>
        )
    }

    // APIにアクセスして掲示板のログ一覧を取得
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

    async getLoginStatus(page, url) {
        await page.goto(url)
        return await page.evaluate(() => document.getElementById('g-console').children[0].firstChild.textContent.trim())
    }

    async getPolarData() {
        const input = {
            id: secret.id,
            password: secret.password,
        }

        // try {
        //     const browser = await puppeteer.launch()
        //     const page = await browser.newPage()
        
        //     const btnText = await getLoginStatus(page, 'https://www.b-monster.jp/')
        
        //     if (btnText === 'LOGIN') {
        //         // ログインモーダルを開く 
        //         let modalTriggerBtn = await page.$('#g-console .modal-trigger');
        //         await modalTriggerBtn.click();
        //         await page.waitFor(1000);
        
        //         // フォームに入力
        //         await page.type("#your-id", input.id);
        //         await page.type("#your-password", input.password);
        //         let loginBtn = await page.$('#login-btn');
        //         await loginBtn.click();
        //         await page.waitFor(1000);
        
        //         // ポラールのアクティビティ画面へ遷移
        //         const polarActivity = await page.$('#contents a[href="https://www.b-monster.jp/mypage/activity_report/"]');
        //         await polarActivity.click();
        //         await page.waitFor(1000);
        //         await page.screenshot({path: 'home2.png', fullPage: true});
        
        //         // 日時・時間・消費カロリーを取得する
        //         let list = await page.$$('#main-container .activity-report-list a');
        //         var datas = [];
        //         for (let i = 0; i < list.length; i++) {
        //           var data = {
        //             date: await list[i].$eval('.activity-report-list-date .day', nodes => nodes.innerText),
        //             time: await list[i].$eval('.activity-report-list-detail .time', nodes => nodes.innerText),
        //             col: await list[i].$eval('.col .value', nodes => nodes.innerText),
        //           };
        //           datas.push(data);
        //         }
        //         console.log(datas)
        //     }
        
        //     browser.close()
        //   } catch(e) {
        //     console.error(e)
        //   }
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
    form: {
        padding: 16,
    },
    textField: {
        color: 'white',
    },
    right: {
        textAlign: 'right'
    }
}

ReactDOM.render(
  <BBSApp />,
  document.getElementById('root'))
