import Dexie from "dexie";

describe("IPアドレスの履歴データベースを確認する。", () => {
  it("データベースが存在しないことを確認する。", () => {
    Dexie.exists("Glipah").then(exists => {
      expect(exists).toBeFalsy();
    });
  });
});
