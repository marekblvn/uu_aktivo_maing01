/* eslint-disable */

const attendanceCreateDtoInType = shape({
  datetimeId: id().isRequired(),
});

const attendanceListDtoInType = shape({
  filters: shape({
    activityId: id(),
    before: date(),
    after: date(),
  }),
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
