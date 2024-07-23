const { TestHelper } = require("uu_script_devkitg01");

describe("AktivoMainInitRollback", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("aktivo-main/init-rollback.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
