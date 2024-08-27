/* eslint-disable */

const postCreateDtoInType = shape({
  activityId: id().isRequired(),
  content: uu5String(1, 256).isRequired(),
  type: oneOf(["normal", "important"]),
  createdAt: datetime().isRequired(),
});

const postGetDtoInType = shape({
  id: id().isRequired(),
});

const postListDtoInType = shape({
  filters: shape(
    {
      activityId: id(),
      uuIdentity: uuIdentity(),
      uuIdentityName: uu5String(),
      type: oneOf(["normal", "important"]),
      createdAt: array(oneOf([date(), constant(null)]), 1, 2),
    },
    true,
  ),
  sort: shape(
    {
      createdAt: integer(-1, 1),
    },
    true,
  ),
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
