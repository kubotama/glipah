import axios from "axios";
import Dexie from "dexie";
import { shallowMount } from "@vue/test-utils";
import GlipahUi from "@/components/GlipahUi.vue";

global.indexedDB = require("fake-indexeddb");
global.IDBCursor = require("fake-indexeddb/lib/FDBCursor");
global.IDBCursorWithValue = require("fake-indexeddb/lib/FDBCursorWithValue");
global.IDBDatabase = require("fake-indexeddb/lib/FDBDatabase");
global.IDBFactory = require("fake-indexeddb/lib/FDBFactory");
global.IDBIndex = require("fake-indexeddb/lib/FDBIndex");
global.IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
global.IDBObjectStore = require("fake-indexeddb/lib/FDBObjectStore");
global.IDBOpenDBRequest = require("fake-indexeddb/lib/FDBOpenDBRequest");
global.IDBRequest = require("fake-indexeddb/lib/FDBRequest");
global.IDBTransaction = require("fake-indexeddb/lib/FDBTransaction");
global.IDBVersionChangeEvent = require("fake-indexeddb/lib/FDBVersionChangeEvent");

let ipToUse = "";
jest.mock("axios");
axios.get.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    data: { "client-ip": ipToUse }
  })
);

const OriginalDate = Date;
let dateToUse = null;
jest.spyOn(global, "Date").mockImplementation(arg => {
  return arg ? new OriginalDate(arg) : dateToUse;
});
Date.now = jest.fn(() => OriginalDate.now());

describe("初回アクセスのテスト", () => {
  let wrapper;
  let db;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    db = new Dexie("Glipah");
    db.version(1).stores({ access: "++id, ipAddress" });
  });

  it("データベースが存在することを確認する。", done => {
    dateToUse = new Date("2020-05-06 01:02:03");
    wrapper.vm.accessFunction().then(() => {
      Dexie.exists("Glipah").then(exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });
  });

  it("保存されているデータが1件であることを確認する。", done => {
    db.access
      .clear()
      .then(() => {
        dateToUse = new Date("2020-05-06 01:02:03");
        ipToUse = "ab.cd.ef.gh";
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        return db.access
          .where({ ipAddress: "ab.cd.ef.gh" })
          .toArray()
          .then(addresses => {
            expect(addresses.length).toBe(1);
            expect(addresses[0].ipAddress).toBe("ab.cd.ef.gh");
            expect(addresses[0].accessDate).toBe("2020-05-06 01:02:03");
            done();
          });
      });
  });

  it("保存されているデータが表示されていることを確認する: テストケース1", done => {
    db.access.clear().then(() => {
      dateToUse = new Date("2020-05-6 01:02:03");
      ipToUse = "ab.cd.ef.gh";
      wrapper.vm.accessFunction().then(() => {
        const table = wrapper.find("#ipHistory");
        expect(table.element.rows.length).toBe(2);
        expect(table.element.rows[0].cells.length).toBe(4);
        expect(table.element.rows[0].cells[0].innerHTML).toBe("IPアドレス");
        expect(table.element.rows[0].cells[1].innerHTML).toBe("アクセス回数");
        expect(table.element.rows[0].cells[2].innerHTML).toBe(
          "初回のアクセス日時"
        );
        expect(table.element.rows[0].cells[3].innerHTML).toBe(
          "最新のアクセス日時"
        );
        expect(table.element.rows[1].cells.length).toBe(4);
        expect(table.element.rows[1].cells[0].innerHTML).toBe("ab.cd.ef.gh");
        expect(table.element.rows[1].cells[1].innerHTML).toBe("1");
        expect(table.element.rows[1].cells[2].innerHTML).toBe(
          "2020-05-06 01:02:03"
        );
        expect(table.element.rows[1].cells[3].innerHTML).toBe(
          "2020-05-06 01:02:03"
        );
        done();
      });
    });
  });

  it("保存されているデータが表示されていることを確認する: テストケース1.1", done => {
    db.access.clear().then(() => {
      dateToUse = new Date("2020/06/03 21:32:08");
      ipToUse = "203.0.113.11";
      wrapper.vm.accessFunction().then(() => {
        const table = wrapper.find("#ipHistory");
        expect(table.element.rows.length).toBe(2);
        expect(table.element.rows[0].cells.length).toBe(4);
        expect(table.element.rows[0].cells[0].innerHTML).toBe("IPアドレス");
        expect(table.element.rows[0].cells[1].innerHTML).toBe("アクセス回数");
        expect(table.element.rows[0].cells[2].innerHTML).toBe(
          "初回のアクセス日時"
        );
        expect(table.element.rows[0].cells[3].innerHTML).toBe(
          "最新のアクセス日時"
        );
        expect(table.element.rows[1].cells.length).toBe(4);
        expect(table.element.rows[1].cells[0].innerHTML).toBe("203.0.113.11");
        expect(table.element.rows[1].cells[1].innerHTML).toBe("1");
        expect(table.element.rows[1].cells[2].innerHTML).toBe(
          "2020-06-03 21:32:08"
        );
        expect(table.element.rows[1].cells[3].innerHTML).toBe(
          "2020-06-03 21:32:08"
        );
        done();
      });
    });
  });
});

describe("2回めのアクセス(同じIPアドレス)のテスト", () => {
  let wrapper;
  let db;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    db = new Dexie("Glipah");
    db.version(1).stores({ access: "++id, ipAddress" });
  });

  it("保存されているデータが2件であることを確認する。", done => {
    db.access
      .clear()
      .then(() => {
        dateToUse = new Date("2020-05-06 01:02:03");
        ipToUse = "ab.cd.ef.gh";
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        dateToUse = new Date("2020-05-07 03:49:38");
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        return db.access
          .where({ ipAddress: "ab.cd.ef.gh" })
          .toArray()
          .then(addresses => {
            expect(addresses.length).toBe(2);
            expect(addresses[0].ipAddress).toBe("ab.cd.ef.gh");
            expect(addresses[0].accessDate).toBe("2020-05-06 01:02:03");
            expect(addresses[1].ipAddress).toBe("ab.cd.ef.gh");
            expect(addresses[1].accessDate).toBe("2020-05-07 03:49:38");
            done();
          });
      });
  });

  it.skip("保存されているデータが表示されていることを確認する。", done => {
    db.access
      .clear()
      .then(() => {
        dateToUse = new Date("2020-05-6 01:02:03");
        ipToUse = "ab.cd.ef.gh";
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        dateToUse = new Date("2020-05-07 03:49:38");
        wrapper.vm.accessFunction().then(() => {
          const table = wrapper.find("#ipHistory");
          expect(table.element.rows.length).toBe(3);
          expect(table.element.rows[0].cells[1].innerHTML).toBe("IPアドレス");
          expect(table.element.rows[0].cells[2].innerHTML).toBe("アクセス日時");
          expect(table.element.rows[1].cells[1].innerHTML).toBe("ab.cd.ef.gh");
          expect(table.element.rows[1].cells[2].innerHTML).toBe(
            "2020-05-07 03:49:38"
          );
          expect(table.element.rows[2].cells[1].innerHTML).toBe("ab.cd.ef.gh");
          expect(table.element.rows[2].cells[2].innerHTML).toBe(
            "2020-05-06 01:02:03"
          );
          done();
        });
      });
  });
});

describe("2回めのアクセス(違うIPアドレス)のテスト", () => {
  let wrapper;
  let db;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    db = new Dexie("Glipah");
    db.version(1).stores({ access: "++id, ipAddress" });
  });

  it("保存されているデータが2件であることを確認する。", done => {
    db.access
      .clear()
      .then(() => {
        dateToUse = new Date("2020-05-6 01:02:03");
        ipToUse = "ab.cd.ef.gh";
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        dateToUse = new Date("2020-05-10 00:11:22");
        ipToUse = "11.22.33.44";
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        return db.access.toArray().then(addresses => {
          expect(addresses.length).toBe(2);
          expect(addresses[0].ipAddress).toBe("ab.cd.ef.gh");
          expect(addresses[0].accessDate).toBe("2020-05-06 01:02:03");
          expect(addresses[1].ipAddress).toBe("11.22.33.44");
          expect(addresses[1].accessDate).toBe("2020-05-10 00:11:22");
          done();
        });
      });
  });

  it.skip("保存されているデータが表示されていることを確認する", done => {
    db.access
      .clear()
      .then(() => {
        dateToUse = new Date("2020-05-6 01:02:03");
        ipToUse = "ab.cd.ef.gh";
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        dateToUse = new Date("2020-05-10 00:11:22");
        ipToUse = "11.22.33.44";
        wrapper.vm.accessFunction().then(() => {
          const table = wrapper.find("#ipHistory");
          expect(table.element.rows.length).toBe(3);
          expect(table.element.rows[0].cells[1].innerHTML).toBe("IPアドレス");
          expect(table.element.rows[0].cells[2].innerHTML).toBe("アクセス日時");
          expect(table.element.rows[1].cells[1].innerHTML).toBe("11.22.33.44");
          expect(table.element.rows[1].cells[2].innerHTML).toBe(
            "2020-05-10 00:11:22"
          );
          expect(table.element.rows[2].cells[1].innerHTML).toBe("ab.cd.ef.gh");
          expect(table.element.rows[2].cells[2].innerHTML).toBe(
            "2020-05-06 01:02:03"
          );
          done();
        });
      });
  });
});
