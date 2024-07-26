/* eslint-disable */

const postCreateDtoInType = shape({
  activityId: id().isRequired(),
  content: uu5String(1, 2048).isRequired(),
  type: oneOf(["normal", "important"]),
});

const postGetDtoInType = shape({
  id: id().isRequired(),
});

const postListDtoInType = shape({
  activityId: id(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const postUpdateDtoInType = shape({
  id: id().isRequired(),
  content: uu5String(1, 2048),
  type: oneOf(["normal", "important"]),
});

const postDeleteDtoInType = shape({
  id: id().isRequired(),
});
