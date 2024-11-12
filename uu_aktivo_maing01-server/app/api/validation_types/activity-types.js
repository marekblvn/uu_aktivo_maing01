/* eslint-disable */

const activityCreateDtoInType = shape({
  name: uu5String(1, 48).isRequired(),
  description: uu5String(256),
  location: uu5String(60),
  idealParticipants: integer(0, 100),
  minParticipants: integer(0, 100),
  email: string(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
});

const activityUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(1, 48),
  description: uu5String(256),
  location: uu5String(60),
  idealParticipants: integer(0, 100),
  minParticipants: integer(0, 100),
});

const activityUpdateFrequencyDtoInType = shape({
  id: id().isRequired(),
  frequency: shape({
    months: integer(0, 12).isRequired(),
    days: integer(0, 31).isRequired(),
  }).isRequired(),
});

const activityUpdateNotificationOffsetDtoInType = shape({
  id: id().isRequired(),
  notificationOffset: shape({
    days: integer(0, 31).isRequired(),
    hours: integer(0, 23).isRequired(),
    minutes: integer(0, 59).isRequired(),
  }).isRequired(),
});

const activityGetDtoInType = shape({
  id: id().isRequired(),
});

const activityListDtoInType = shape({
  filters: shape(
    {
      name: uu5String(1, 48),
      recurrent: boolean(),
      owner: uuIdentity(),
      members: array(uuIdentity(), 1, 100),
      hasDatetime: boolean(),
    },
    true,
  ),
  sort: shape(
    {
      name: integer(-1, 1),
      createdAt: integer(-1, 1),
    },
    true,
  ),
  pageInfo: shape({
    pageIndex: integer(),
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

const activityUpdateEmailDtoInType = shape({
  id: id().isRequired(),
  email: oneOf([string(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), constant(null)]),
});
