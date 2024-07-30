const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup({ authEnabled: true });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGALL" });
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("activity/create uuCMD tests", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("StandardUsers", false, false);
    let dtoIn = {
      name: "My Activity",
      location: "Prague",
      minParticipants: 6,
    };
    let awid = TestHelper.getAwid();
    let result = await TestHelper.executePostCommand("activity/create", dtoIn, session, { awid });
    expect(result.status).toEqual(200);
    expect(result.data.name).toBe("My Activity");
    expect(result.data.location).toBe("Prague");
    expect(result.data.description).toBe("");
    expect(result.data.minParticipants).toBe(6);
    expect(result.data.idealParticipants).toBe(0);
    expect(result.data.owner).toBe(session.getIdentity().getUuIdentity());
    expect(result.data.administrators).toEqual([]);
    expect(result.data.members).toEqual([session.getIdentity().getUuIdentity()]);
    expect(result.data.datetimeId).toBe(null);
    expect(result.data.recurrent).toBe(false);
    expect(result.data.frequency).toEqual({});
    expect(result.data.notificationOffset).toEqual({});
    expect(result.data.uuAppErrorMap).toEqual({});
  });

  test("Invalid dtoIn", async () => {
    expect.assertions(3);
    let session = await TestHelper.login("StandardUsers", false, false);
    let dtoIn = {
      description: "This is my activity",
      location: "Prague",
      minParticipants: 6,
    };
    let awid = TestHelper.getAwid();
    try {
      await TestHelper.executePostCommand("activity/create", dtoIn, session, { awid });
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-aktivo-main/activity/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
    }
  });
});
