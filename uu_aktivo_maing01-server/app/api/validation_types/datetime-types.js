/* eslint-disable */

const datetimeCreateDtoInType = shape({
  activityId: id().isRequired(),
  datetime: datetime().isRequired(),
  recurrent: boolean().isRequired(),
  frequency: shape({
    days: integer(0, 365).isRequired(),
    months: integer(0, 12).isRequired(),
  }),
  notificationOffset: shape({
    months: integer(0, 12),
    days: integer(0, 31),
    hours: integer(0, 23),
    minutes: integer(0, 59),
  }).isRequired(),
});

const datetimeCreateNextDtoInType = shape({
  id: id().isRequired(),
});

const datetimeGetDtoInType = shape({
  id: id().isRequired(),
});

const datetimeUpdateParticipationDtoInType = shape({
  id: id().isRequired(),
  type: oneOf(["confirmed", "denied", "undecided"]).isRequired(),
});

const datetimeDeleteDtoInType = shape({
  id: id().isRequired(),
});
