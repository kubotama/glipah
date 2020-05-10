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

jest.mock("axios");
axios.get.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    data: { "client-ip": "ab.cd.ef.gh" }
  })
);

const OriginalDate = Date;
const dateToUse = new Date("2020-05-06 01:02:03");
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

  it("保存されているデータが表示されていることを確認する。", done => {
    db.access.clear().then(() => {
      wrapper.vm.accessFunction().then(() => {
        const table = wrapper.find("#ipHistory");
        expect(table.element.rows.length).toBe(2);
        expect(table.element.rows[0].cells[1].innerHTML).toBe("IPアドレス");
        expect(table.element.rows[0].cells[2].innerHTML).toBe("アクセス日時");
        expect(table.element.rows[1].cells[1].innerHTML).toBe("ab.cd.ef.gh");
        expect(table.element.rows[1].cells[2].innerHTML).toBe(
          "2020-05-06 01:02:03"
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
        return wrapper.vm.accessFunction();
      })
      .then(() => {
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
            expect(addresses[1].accessDate).toBe("2020-05-06 01:02:03");
            done();
          });
      });
  });

  it("保存されているデータが表示されていることを確認する。", done => {
    db.access
      .clear()
      .then(() => {
        return wrapper.vm.accessFunction();
      })
      .then(() => {
        wrapper.vm.accessFunction().then(() => {
          const table = wrapper.find("#ipHistory");
          expect(table.element.rows.length).toBe(3);
          expect(table.element.rows[0].cells[1].innerHTML).toBe("IPアドレス");
          expect(table.element.rows[0].cells[2].innerHTML).toBe("アクセス日時");
          expect(table.element.rows[1].cells[1].innerHTML).toBe("ab.cd.ef.gh");
          expect(table.element.rows[1].cells[2].innerHTML).toBe(
            "2020-05-06 01:02:03"
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
