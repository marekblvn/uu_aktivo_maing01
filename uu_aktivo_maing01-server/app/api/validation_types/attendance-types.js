/* eslint-disable */

const attendanceCreateDtoInType = shape({
  datetimeId: id().isRequired(),
});

const attendanceListDtoInType = shape({
  filters: shape(
    {
      activityId: id(),
      datetime: array(oneOf([date(), constant(null)]), 1, 2),
    },
    true,
  ),
  sort: shape(
    {
      datetime: integer(-1, 1),
    },
    true,
  ),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const attendanceGetStatisticsDtoInType = shape({
  filters: shape({
    activityId: id().isRequired(),
    before: date(),
    after: date(),
  }).isRequired(),
});

const attendanceDeleteDtoInType = shape({
  id: id().isRequired(),
});
