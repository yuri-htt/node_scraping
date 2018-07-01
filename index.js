const puppeteer = require('puppeteer')

async function getLoginStatus(page, url){
    // b-monsterのwebページを開く
    await page.goto(url)
    // 任意のJavaScriptを実行
    return await page.evaluate(() => document.getElementById('g-console').children[0].firstChild.textContent.trim())
}

async function getModal(page){
    return await page.evaluate(() => document.getElementById('login-modal'))
}


!(async() => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const btnText = await getLoginStatus(page, 'https://www.b-monster.jp/')
    await page.screenshot({path: 'home1.png', fullPage: true});

    if (btnText === 'LOGIN') {
        let button = await page.$('#g-console .modal-trigger');
        await button.click();

        const frame = await page.frames().find(f => f.name() === 'gdm_advFrame');
        if (frame) {
            await page.waitFor(3000);
            await page.screenshot({path: 'home2.png', fullPage: true});

            const tableList = page.$$eval("table tr", trList => {
                console.log('1')
                return trList.map(tr => {
                    console.log('2')
                  return {
                    key:   tr.querySelector("td.key").innerText.trim(),
                    value: tr.querySelector("td.value").innerText.trim()
                  };
                })
            });
            console.log(tableList)
        }
    }

    browser.close()
  } catch(e) {
    console.error(e)
  }
})()