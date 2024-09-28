const nodemailer = require("nodemailer");
const AppClient = require("uu_appg01_server").AppClient;
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const dtoInSchema = `
  const sendNotificationDtoInSchemaType = shape({
    baseUri: uri().isRequired(),
    activityId: id().isRequired(),
  })
`;

const Errors = {
  ERROR_PREFIX: "uu-aktivo-scriptsg01/send-notification/",
  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap) {
      super({ dtoOut, paramMap, status: 400 });
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}invalidDtoIn`;
    }
  },
  ActivityGetFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd activity/get failed.";
      this.code = `${Errors.ERROR_PREFIX}activityGetFailed`;
    }
  },
};

function validateDtoIn(dtoInSchema) {
  const validator = new Validator(dtoInSchema);
  const validationResult = validator.validate("sendNotificationDtoInSchemaType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}

async function getActivity(activityId) {
  const activityGetDtoIn = {
    id: activityId,
  };
  let activityGetDtoOut;
  try {
    activityGetDtoOut = await aktivoClient.cmdGet("activity/get", activityGetDtoIn);
  } catch (error) {
    throw new Errors.ActivityGetFailed(dtoOut, { id: activityId }, error);
  }
  console.info("Retrieved activity: ", JSON.stringify(activityGetDtoOut, null, 2));
  return activityGetDtoOut;
}

async function sendEmailNotification(transporter, activity) {
  const { name, members, id } = activity;

  const receiverEmailList = members.filter((member) => member.email !== null).map((member) => member.email);

  if (receiverEmailList.length === 0) {
    console.info("Found no receiver emails. Notification will not be sent.");
    return;
  }

  // !!! This is the development version --- sender address is created in ethereal.mail to prevent sending actual emails to receivers
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: receiverEmailList.join(","), // list of receivers
    subject: `Aktivo - ${name}`, // Subject line
    html: `<p><a href='http://localhost:1234/uu-aktivo-maing01/0/activity?id=${id}' target='_blank'>Go to your activity</a></p>`,
  });

  console.info(`Message sent: ${info.messageId}`);
}

const { dtoIn, console, session } = scriptContext;
const dtoOut = {};
let aktivoClient;

async function main() {
  const uuAppErrorMap = validateDtoIn(dtoInSchema);
  aktivoClient = new AppClient({ baseUri: dtoIn.baseUri, session });

  const activity = await getActivity(dtoIn.activityId);

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "abe2@ethereal.email",
      pass: "GYCgv8WGVUXn2f9uFX",
    },
  });

  try {
    await sendEmailNotification(transporter, activity);
  } catch (error) {
    console.error(error);
  }

  dtoOut.uuAppErrorMap = uuAppErrorMap;
  return dtoOut;
}

main();
