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
    days: integer(0, 31).isRequired(),
    hours: integer(0, 23).isRequired(),
    minutes: integer(0, 59).isRequired(),
  }).isRequired(),
});

const datetimeCreateNextDtoInType = shape({
  id: id().isRequired(),
});

const datetimeGetDtoInType = shape({
  id: id().isRequired(),
});

const datetimeListDtoInType = shape({
  filters: shape(
    {
      datetime: array(oneOf([datetime(), constant(null)]), 1, 2),
      notification: array(oneOf([datetime(), constant(null)]), 1, 2),
    },
    true,
  ),
  sort: shape(
    {
      datetime: integer(-1, 1),
      notification: integer(-1, 1),
    },
    true,
  ),
  withActivity: boolean(),
  pageInfo: shape({
    pageIndex: integer(0, null),
    pageSize: integer(0, null),
  }),
});

const datetimeUpdateParticipationDtoInType = shape({
  id: id().isRequired(),
  type: oneOf(["confirmed", "denied", "undecided"]).isRequired(),
});

const datetimeDeleteDtoInType = shape({
  id: id().isRequired(),
});
