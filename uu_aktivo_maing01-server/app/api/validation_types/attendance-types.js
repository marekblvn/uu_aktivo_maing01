/* eslint-disable */

const attendanceCreateDtoInType = shape({
  datetimeId: id().isRequired(),
});

const attendanceListDtoInType = shape({
  activityId: id(),
  before: date(),
  after: date(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});
