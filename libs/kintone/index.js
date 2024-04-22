const path = require('node:path');
const fs = require('node:fs');
const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

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
      .pipe(process.stdout)

    const client = new KintoneRestAPIClient({
        baseUrl: process.env.BASE_URL,
        auth: { apiToken: process.env.KINTONE_API_TOKEN },
    });
    console.dir(client);
})();