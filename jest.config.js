module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  clearMocks: true,
  testURL: "http://localhost:8080/",
  setupFiles: ["fake-indexeddb/auto", "./tests/unit/setup.js"]
};
