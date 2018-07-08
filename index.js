const puppeteer = require('puppeteer')

const secret = require('./secret')

async function getLoginStatus(page, url){
    await page.goto(url)
    return await page.evaluate(() => document.getElementById('g-console').children[0].firstChild.textContent.trim())
}

const input = {
    id: secret.id,
    password: secret.password,
}

!(async() => {
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
        console.log(datas)
    }

    browser.close()
  } catch(e) {
    console.error(e)
  }
})()