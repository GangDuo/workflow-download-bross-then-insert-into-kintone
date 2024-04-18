const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

(async () => {
    const client = new KintoneRestAPIClient({
        baseUrl: process.env.BASE_URL,
        auth: { apiToken: process.env.KINTONE_API_TOKEN },
    });
    console.dir(client);
})();