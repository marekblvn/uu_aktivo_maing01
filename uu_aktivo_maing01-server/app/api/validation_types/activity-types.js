/* eslint-disable */

const activityCreateDtoInType = shape({
  name: uu5String(1, 256).isRequired(),
  description: uu5String(512),
  location: uu5String(256),
  idealParticipants: integer(0, 1000),
  minParticipants: integer(0, 1000),
});

const activityUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(1, 256),
  description: uu5String(512),
  location: uu5String(256),
  idealParticipants: integer(0, 1000),
  minParticipants: integer(0, 1000),
  recurrent: boolean(),
  frequency: shape({
    days: integer(0, 365),
    months: integer(0, 12),
  }),
  notificationOffset: shape({
    months: integer(0, 12),
    days: integer(0, 30),
    hours: integer(0, 23),
    minutes: integer(0, 59),
  }),
});

const activityGetDtoInType = shape({
  id: id().isRequired(),
});

const activityListDtoInType = shape({
  filters: shape({
    state: oneOf(["active", "suspended"]),
    recurrent: boolean(),
    owner: uuIdentity(),
    members: array(uuIdentity(), 1, 1000),
  }),
  pageInfo: shape({
    pageInfo: integer(),
    pageSize: integer(),
  }),
});

const activityAddAdministratorDtoInType = shape({
  id: id().isRequired(),
  uuIdentity: uuIdentity().isRequired(),
});

const activityRemoveAdministratorDtoInType = shape({
  id: id().isRequired(),
  uuIdentity: uuIdentity().isRequired(),
});

const activityTransferOwnershipDtoInType = shape({
  id: id().isRequired(),
  uuIdentity: uuIdentity().isRequired(),
});

const activityRemoveMemberDtoInType = shape({
  id: id().isRequired(),
  uuIdentity: uuIdentity().isRequired(),
});

const activityLeaveDtoInType = shape({
  id: id().isRequired(),
});

const activityDeleteDtoInType = shape({
  id: id().isRequired(),
});
