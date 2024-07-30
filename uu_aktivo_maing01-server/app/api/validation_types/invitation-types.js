/* eslint-disable */

const invitationCreateDtoInType = shape({
  activityId: id().isRequired(),
  uuIdentity: uuIdentity().isRequired(),
});

const invitationGetDtoInType = shape({
  id: id().isRequired(),
});

const invitationListDtoInType = shape({
  filters: shape({
    activityId: id(),
    uuIdentity: uuIdentity(),
  }),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const invitationAcceptDtoInType = shape({
  id: id().isRequired(),
});

const invitationRejectDtoInType = shape({
  id: id().isRequired(),
});

const invitationDeleteDtoInType = shape({
  id: id().isRequired(),
});
