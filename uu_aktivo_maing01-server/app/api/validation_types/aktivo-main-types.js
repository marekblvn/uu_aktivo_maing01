/* eslint-disable */

const initDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri(),
  name: uu5String(512),
  sysState: oneOf(["active", "restricted", "readOnly"]),
  adviceNote: shape({
    message: uu5String().isRequired(),
    severity: oneOf(["debug", "info", "warning", "error", "fatal"]),
    estimatedEndTime: datetime(),
  }),
  secrets: shape({
    nodemailer: shape({
      host: uu5String().isRequired(),
      port: integer().isRequired(), // default 587
      user: uu5String().isRequired(),
      pass: uu5String().isRequired(),
    }),
  }),
});

const sendEmailNotificationDtoInType = shape({
  activityId: id().isRequired(),
  activityName: uu5String().isRequired(),
  receiverEmailList: array(uu5String(), 100).isRequired(),
  emailHtmlContent: uu5String().isRequired("emailTextContent"),
  emailTextContent: uu5String(),
});
