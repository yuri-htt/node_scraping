const puppeteer = require('puppeteer')

// データベースに接続
const NeDB = require('nedb')
const path = require('path')
const db = new NeDB({
    filename: path.join(__dirname, 'scraping.db'),
    autoload: true
})

// Webサーバーを起動
const express = require('express')
const app = express()
const portNo = 3001
app.listen(portNo, () => {
    console.log('起動完了', `http://localhost:${portNo}`)
})

app.use('/public', express.static('./public'))
app.get('/', (req, res) => {
    res.redirect(302, '/public')
})

// API:DBからデータ取得
app.get('/api/getItems', (req, res) => {
    // データベースを書き込み時刻でソートして一覧を返す
    db.find({}).sort({stime: 1}).exec((err, data) => {
        if (err) {
            sendJSON(res, false, {logs: [], msg: err})
            return
        }
        sendJSON(res, true, {logs: data})
    })
})

app.get('/api/getPolarData', async (req, res) => {
    const polarDatas = await getPolarData(req.query)
    db.insert({
        polarDatas: polarDatas,
    }, (err, doc) => {
        if (err) {
            console.error(err)
            sendJSON(res, false, {msg: err})
            return
        }
        sendJSON(res, true, {id: doc._id})
    })
})
  
// API:DBにデータを保存
app.get('/api/write', (req, res) => {
    const q = req.query
    // URLパラメータの値をDBに書き込む
    db.insert({
        name: q.name,
        body: q.body,
        stime: (new Date()).getTime()
    }, (err, doc) => {
        if (err) {
            console.error(err)
            sendJSON(res, false, {msg: err})
            return
        }
        sendJSON(res, true, {id: doc._id})
    })
})

function sendJSON (res, result, obj) {
    obj['result'] = result
    res.json(obj)
}

async function getPolarData(query) {
    const input = {
        id: query.id,
        password: query.password,
    }

    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
    
        const btnText = await getLoginStatus(page, 'https://www.b-monster.jp/')
    
        if (btnText === 'LOGIN') {
            // ログインモーダルを開く 
            let modalTriggerBtn = await page.$('#g-console .modal-trigger');
            await modalTriggerBtn.click();
            await page.waitFor(1000);
    
            // フォームに入力
            await page.type("#your-id", input.id);
            await page.type("#your-password", input.password);
            let loginBtn = await page.$('#login-btn');
            await loginBtn.click();
            await page.waitFor(1000);
    
            // ポラールのアクティビティ画面へ遷移
            const polarActivity = await page.$('#contents a[href="https://www.b-monster.jp/mypage/activity_report/"]');
            await polarActivity.click();
            await page.waitFor(1000);
            await page.screenshot({path: 'home2.png', fullPage: true});
    
            // 日時・時間・消費カロリーを取得する
            let list = await page.$$('#main-container .activity-report-list a');
            var datas = [];
            for (let i = 0; i < list.length; i++) {
              var data = {
                date: await list[i].$eval('.activity-report-list-date .day', nodes => nodes.innerText),
                time: await list[i].$eval('.activity-report-list-detail .time', nodes => nodes.innerText),
                col: await list[i].$eval('.col .value', nodes => nodes.innerText),
              };
              datas.push(data);
            }
        }
    
        browser.close()
        return datas
    } catch(e) {
        console.error(e)
    }
}

async function getLoginStatus(page, url){
    // b-monsterのwebページを開く
    await page.goto(url)
    // 任意のJavaScriptを実行
    return await page.evaluate(() => document.getElementById('g-console').children[0].firstChild.textContent.trim())
}