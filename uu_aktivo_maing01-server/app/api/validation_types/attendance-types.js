/* eslint-disable */

const attendanceCreateDtoInType = shape({
  datetimeId: id().isRequired(),
});

const attendanceListDtoInType = shape({
  filters: shape({
    activityId: id(),
    before: date(),
    after: date(),
    archived: boolean(),
  }),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const attendanceListStatisticsDtoInType = shape({
  filters: shape({
    activityId: id().isRequired(),
    before: date(),
    after: date(),
    archived: boolean(),
  }).isRequired(),
  sort: shape({
    confirmedCount: integer(-1, 1),
    deniedCount: integer(-1, 1),
    undecidedCount: integer(-1, 1),
  }),
});

const attendanceDeleteDtoInType = shape({
  id: id().isRequired(),
});
