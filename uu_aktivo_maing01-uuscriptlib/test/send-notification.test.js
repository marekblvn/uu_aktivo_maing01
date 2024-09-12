const { TestHelper } = require("uu_script_devkitg01");

describe("SendNotification", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {
      baseUri: "http://localhost:8080/uu-aktivo-maing01/22222222222222222222222222222222/",
      activityId: "66e19b798f90b16844e56e71", // replace with actual id of activity in dev db
    };

    const result = await TestHelper.runScript("send-notification.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
