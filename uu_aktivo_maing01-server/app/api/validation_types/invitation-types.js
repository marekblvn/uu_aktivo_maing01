/* eslint-disable */

const invitationCreateDtoInType = shape({
  activityId: id().isRequired(),
  uuIdentity: uuIdentity().isRequired(),
});

const invitationGetDtoInType = shape({
  id: id().isRequired(),
});

const invitationListDtoInType = shape({
  filters: shape(
    {
      activityId: id(),
      uuIdentity: uuIdentity(),
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

const invitationAcceptDtoInType = shape({
  id: id().isRequired(),
  email: string(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
});

const invitationDeleteDtoInType = shape({
  id: id().isRequired(),
});
