const puppeteer = require('puppeteer')

async function getLoginStatus(page, url){
    // b-monsterのwebページを開く
    await page.goto(url)
    // 任意のJavaScriptを実行
    return await page.evaluate(() => document.getElementById('g-console').children[0].firstChild.textContent.trim())
}

const input = {
    id: '',
    password: '',
}

!(async() => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const btnText = await getLoginStatus(page, 'https://www.b-monster.jp/')
    await page.screenshot({path: 'home1.png', fullPage: true});

    if (btnText === 'LOGIN') {
        let modalTriggerBtn = await page.$('#g-console .modal-trigger');
        await modalTriggerBtn.click();

        await page.waitFor(2000);
        await page.screenshot({path: 'home1.png', fullPage: true});

        await page.type("#your-id", input.id);
        await page.type("#your-password", input.password);
        await page.waitFor(1000);
        await page.screenshot({path: 'home2.png', fullPage: true});

        let loginBtn = await page.$('#login-btn');
        await loginBtn.click();
        await page.waitFor(2000);
        await page.screenshot({path: 'home3.png', fullPage: true});


    }

    browser.close()
  } catch(e) {
    console.error(e)
  }
})()