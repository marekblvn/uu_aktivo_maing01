/* eslint-disable */

const postCreateDtoInType = shape({
  activityId: id().isRequired(),
  content: uu5String(1, 256).isRequired(),
  type: oneOf(["normal", "important"]),
});

const postGetDtoInType = shape({
  id: id().isRequired(),
});

const postListDtoInType = shape({
  filters: shape({
    activityId: id(),
    uuIdentity: uuIdentity(),
  }),
  sort: shape({
    createdAt: integer(),
  }),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const postUpdateDtoInType = shape({
  id: id().isRequired(),
  content: uu5String(1, 256),
  type: oneOf(["normal", "important"]),
});

const postDeleteDtoInType = shape({
  id: id().isRequired(),
});
