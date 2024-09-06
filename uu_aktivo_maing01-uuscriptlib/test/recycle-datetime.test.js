const { TestHelper } = require("uu_script_devkitg01");

describe("RecycleDatetime", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {
      baseUri: "http://localhost:8080/uu-aktivo-maing01/22222222222222222222222222222222/",
      id: "66cf128177287b0c992f8fa0",
    };

    const result = await TestHelper.runScript("recycle-datetime.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
