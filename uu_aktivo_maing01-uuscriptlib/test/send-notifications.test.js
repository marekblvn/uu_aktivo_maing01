const { TestHelper } = require("uu_script_devkitg01");

describe("SendNotifications", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {
      aktivoServerBaseUri: "http://localhost:8080/uu-aktivo-maing01/22222222222222222222222222222222/",
      aktivoClientBaseUri: "http://localhost:1234/uu-aktivo-maing01/0/",
    };

    const result = await TestHelper.runScript("send-notifications.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
