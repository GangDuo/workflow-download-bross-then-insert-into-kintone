const path = require('node:path');
const fs = require('node:fs');
const { KintoneRestAPIClient } = require("@kintone/rest-api-client");
const csv = require('csv');
const iconv = require('iconv-lite');

(async () => {
    const filePath = path.resolve(process.argv[2] ?? '.');
	console.log(filePath)
    try {
        const stats = await fs.promises.stat(filePath)
        if (!stats.isFile()) {
            throw new Error('ファイルを指定してください！')
        }
    } catch (error) {
        console.log(error)
        return
    }

    fs.createReadStream(filePath)
        .pipe(iconv.decodeStream('Shift_JIS'))
        .pipe(csv.parse())
        .pipe(csv.transform((record) => {
            const requiredColumns = record.filter((clms, i) => [0, 1, 2, 4, 5, 7].includes(i));
            return requiredColumns.reduce((ax, clm, i) => {
                const labels = ["請求年月", "請求先コード", "ａｕ電話番号", "内訳項目名", "金額", "記事欄"];
                ax[`${labels[i]}`] = { value: clm };
                return ax;
            }, { "請求先名": { value: "直営" }});
        }, (err, result) => {
            console.dir(result);
            console.log(`結果取得: ${result.length}}`);
        }))
        .pipe(csv.stringify({
            quoted: true
        }))
        .pipe(process.stdout)

    const client = new KintoneRestAPIClient({
        baseUrl: process.env.BASE_URL,
        auth: { apiToken: process.env.KINTONE_API_TOKEN },
    });
    console.dir(client);
})();