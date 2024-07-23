const { TestHelper } = require("uu_script_devkitg01");

describe("AktivoMainInit", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("aktivo-main/init.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
