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
    data: { "client-ip": "zz.zz.zz.zz" }
  })
);

const OriginalDate = Date;
const dateToUse = new Date("2020-04-30 12:34:56");
jest.spyOn(global, "Date").mockImplementation(arg => {
  return arg ? new OriginalDate(arg) : dateToUse;
});
Date.now = jest.fn(() => OriginalDate.now());

describe("初回アクセスのテスト", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
  });

  it("データベースが存在することを確認する。", done => {
    Dexie.exists("Glipah").then(exists => {
      expect(exists).toBeTruthy();
      done();
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("保存されているデータが1件であることを確認する。", async () => {
    const db = new Dexie("Glipah");
    db.version(1).stores({ access: "++id, ipAddress" });
    // db.open().catch(err => {
    //   console.error("Failed to open db: " + (err.stack || err));
    // });
    db.open();
    const addresses = await db.access
      .where({ ipAddress: "zz.zz.zz.zz" })
      .toArray();
    expect(addresses.length).toBe(1);
  });
});
