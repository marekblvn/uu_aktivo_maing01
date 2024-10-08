const { TestHelper } = require("uu_script_devkitg01");

describe("RecycleDatetimes", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {
      aktivoServerBaseUri: "http://localhost:8080/uu-aktivo-maing01/22222222222222222222222222222222/",
      intervalInMinutes: 10,
    };

    const result = await TestHelper.runScript("recycle-datetimes.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
