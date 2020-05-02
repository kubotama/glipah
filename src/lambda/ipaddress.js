export function handler(event, context, callback) {
  const returnData = {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" }
  };
  // テスト環境では、ボタンが表示されているページとNetlify Functionsのポート番号が違うためCORS制約に違反する。
  // CORS制約を回避するためにAccess-Control-Allow-Origin属性を設定する。
  // ローカル環境の判定は、event.headers.originあるいはevent.headers.refererに設定されているURLのポート番号が8080の場合、
  // とする。
  let url;
  if (event.headers.origin) {
    url = new URL(event.headers.origin);
  } else if (event.headers.referer) {
    url = new URL(event.headers.referer);
  }
  if (url && url.port == 8080) {
    returnData.body = "xx.xx.xx.xx";
    if (!event.headers["user-agent"].match(/axios/)) {
      if (event.headers.origin) {
        returnData.headers["Access-Control-Allow-Origin"] =
          event.headers.origin;
      } else if (event.headers.referer) {
        returnData.headers["Access-Control-Allow-Origin"] =
          event.headers.referer;
      }
    }
  } else {
    // returnData.body = event.headers["client-ip"];
    returnData.body = event.headers["X-Forwarded-For"];
  }
  callback(null, returnData);
}
