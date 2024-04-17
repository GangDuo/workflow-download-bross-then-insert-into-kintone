const puppeteer = require('puppeteer');

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Navigate the page to a URL
    await page.goto(process.env.URL);
  
    // Set screen size
    await page.setViewport({width: 1080, height: 1024});
  
    // アカウント入力ページへ移動する
    await page.click('#site > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td.sidenavibg > table:nth-child(1) > tbody > tr:nth-child(1) > td > a');
    await page.waitForSelector('#reqCD');
  
    await page.type('#reqCD', process.env.REQUEST_CODE);
    await page.type('#userID', process.env.USER_ID);
    await page.type('#password', process.env.PASSWORD);
    // ログインボタンクリック
    await page.click('#sousin');
    
    await page.waitForSelector('#d2 > img');
	await page.evaluate(_ => {
		// 月次データダウンロード
		document.querySelector('#d2 > img').click();
	});

    await page.waitForSelector('#mDataList2\\.dlFlg');
	await page.evaluate(_ => {
		// 回線別請求内訳【コード付き】にチェック入れる
		document.querySelector('#mDataList2\\.dlFlg').click();
	});

    await page.screenshot({path: './screenshot.png'});
    await browser.close();
})();