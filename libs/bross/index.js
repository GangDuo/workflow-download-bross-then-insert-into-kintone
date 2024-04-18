const puppeteer = require('puppeteer');
const path = require('node:path');
const fs = require('node:fs');

const DOWNLOAD_TIMEOUT = 60000;

(async () => {
	const downloadPath = path.resolve(process.argv[2] ?? '.');
	process.stdout.write(downloadPath)
	if(!fs.existsSync(downloadPath)) {
		process.stderr.write('有効なダウンロードパスを指定してください！')
		return
	}

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // ダウンロードプロセスを監視する
	// ファイルダウンロードの準備
    const cdpSession = await page.createCDPSession()
    await cdpSession.send('Browser.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath,
        eventsEnabled: true,
    });
    const downloaded = new Promise((resolve, reject) => {
        let suggestedFilename = '';
        cdpSession.on(
            "Browser.downloadProgress",
            (params) => {
                if (params.state == "completed") {
                    resolve(suggestedFilename);
                } else if (params.state == "canceled") {
                    reject("download cancelled");
                }
            }
        );
        cdpSession.on(
            "Browser.downloadWillBegin",
            (params) => {
                suggestedFilename = params.suggestedFilename
            });
    });

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

    await page.waitForSelector('#sousin');
    await page.evaluate(_ => {
        // zipファイルをダウンロード
        // idが複数定義されているため、getElementByIdは使えない
        document.querySelectorAll('#sousin')[1].click();
    });

    const controller = new AbortController();
    await Promise.race([
        downloaded,
        new Promise((_resolve, reject) => {
            const timeoutID = setTimeout(() => {
                reject('download timed out');
            }, DOWNLOAD_TIMEOUT);

            controller.signal.addEventListener("abort", () => {
                clearTimeout(timeoutID);
                reject();
            }, { once: true });
        }),
    ]);
    controller.abort();

    await page.screenshot({path: './screenshot.png'});
    await browser.close();
})();