# workflow-download-bross-then-insert-into-kintone

## 概要

KDDI Brossデータをダウンロードし、kintoneアプリ（ブロスデータ）へ登録する。

## 準備

環境変数を設定する。

```
# KDDI Bross
URL = <KDDI Bross URL>
REQUEST_CODE = <一括請求コード>
USER_ID = <ユーザーID>
PASSWORD = <パスワード>

OUT_FILE = <出力するCSVファイルパス>

# kintone
BASE_URL = <kintone URL>
APP_ID = <アプリID>
KINTONE_API_TOKEN = <APIトークン（複数のAPIトークンを指定するには、カンマ区切り）>
```