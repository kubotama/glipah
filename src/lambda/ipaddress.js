export function handler(event, context, callback) {
  const returnData = {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(event)
  };
  // テスト環境では、ボタンが表示されているページとNetlify Functionsのポート番号が違うためCORS制約に違反する。
  // CORS制約を回避するためにAccess-Control-Allow-Origin属性を設定する。
  let url;
  if (event.headers.origin) {
    url = new URL(event.headers.origin);
  } else if (event.headers.referer) {
    url = new URL(event.headers.referer);
  }
  if (url && url.port == 8080 && !event.headers["user-agent"].match(/axios/)) {
    if (event.headers.origin) {
      returnData.headers["Access-Control-Allow-Origin"] = event.headers.origin;
    } else if (event.headers.referer) {
      returnData.headers["Access-Control-Allow-Origin"] = event.headers.referer;
    }
  }
  callback(null, returnData);
}
