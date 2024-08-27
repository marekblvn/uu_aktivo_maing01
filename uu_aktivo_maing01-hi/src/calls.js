import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

// NOTE During frontend development it's possible to redirect uuApp command calls elsewhere, e.g. to production/staging
// backend, by configuring it in *-hi/env/development.json:
//   "uu5Environment": {
//     "callsBaseUri": "https://uuapp-dev.plus4u.net/vnd-app/awid"
//   }

const Calls = {
  call(method, url, dtoIn, clientOptions) {
    return Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
  },

  Activity: {
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/create");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/get");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/list");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    update(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/update");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    updateFrequency(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/updateFrequency");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    updateNotificationOffset(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/updateNotificationOffset");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    addAdministrator(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/addAdministrator");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    removeAdministrator(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/removeAdministrator");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    transferOwnership(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/transferOwnership");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    removeMember(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/removeMember");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    leave(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/leave");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("activity/delete");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
  },

  Post: {
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("post/create");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("post/get");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("post/list");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    update(dtoIn) {
      const commandUri = Calls.getCommandUri("post/update");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("post/delete");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
  },

  Invitation: {
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("invitation/create");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("invitation/get");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("invitation/list");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    accept(dtoIn) {
      const commandUri = Calls.getCommandUri("invitation/accept");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("invitation/delete");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
  },

  Attendance: {
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("attendance/create");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("attendance/list");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    getStatistics(dtoIn) {
      const commandUri = Calls.getCommandUri("attendance/getStatistics");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("attendance/delete");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
  },

  Datetime: {
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("datetime/create");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    createNext(dtoIn) {
      const commandUri = Calls.getCommandUri("datetime/createNext");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("datetime/get");
      return Calls.call("cmdGet", commandUri, dtoIn);
    },
    updateParticipation(dtoIn) {
      const commandUri = Calls.getCommandUri("datetime/updateParticipation");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("datetime/delete");
      return Calls.call("cmdPost", commandUri, dtoIn);
    },
  },

  // // example for mock calls
  // loadDemoContent(dtoIn) {
  //   const commandUri = Calls.getCommandUri("loadDemoContent");
  //   return Calls.call("cmdGet", commandUri, dtoIn);
  // },

  getAuthorizedProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/getAuthorizedProfiles");
    return Calls.call("cmdGet", commandUri);
  },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("cmdGet", commandUri);
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("cmdPost", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("cmdGet", commandUri);
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  getCommandUri(useCase, baseUri = Environment.appBaseUri) {
    return (!baseUri.endsWith("/") ? baseUri + "/" : baseUri) + (useCase.startsWith("/") ? useCase.slice(1) : useCase);
  },
};

export default Calls;
