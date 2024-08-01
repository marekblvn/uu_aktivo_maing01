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

const attendanceDeleteDtoInType = shape({
  id: id().isRequired(),
});
