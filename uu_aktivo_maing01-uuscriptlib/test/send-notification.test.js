const { TestHelper } = require("uu_script_devkitg01");

describe("SendNotification", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("send-notification.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
