const nodemailer = require("nodemailer");
const AppClient = require("uu_appg01_server").AppClient;
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const emailHtml = (url, activityName) => `
  <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notification Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    background-color: rgb(33, 150, 243);
                    padding: 20px;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    margin: 20px 0;
                }
                .content h2 {
                    font-size: 20px;
                    margin: 0 0 10px;
                }
                .content p {
                    font-size: 16px;
                    margin: 10px 0;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .btn {
                    background-color: rgb(33, 150, 243);
                    color: white;
                    padding: 15px 25px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>

        <div class="container">
            <div class="header">
                <h1>Aktivo Notification</h1>
            </div>

            <div class="content">
                <h2>Hello,</h2>
                <p>You have a notification from activity '${activityName}'. Click the button below to go to the activity:</p>

                <div class="button-container">
                    <a href="${url}" class="btn">Go to activity</a>
                </div>

                <p>If the button doesn't work, copy and paste the following link into your browser:</p>
                <a>${url}</a>
            </div>

            <div class="footer">
                <p>&copy; 2024 Aktivo. All rights reserved.</p>
            </div>
        </div>

        </body>
        </html>
`;

const dtoInSchema = `
  const sendNotificationsDtoInType = shape({
    aktivoClientBaseUri: uri().isRequired(),
    aktivoServerBaseUri: uri().isRequired(),
  })
`;

const Errors = {
  ERROR_PREFIX: "uu-aktivo-scriptsg01/send-notifications/",
  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap) {
      super({ dtoOut, paramMap, status: 400 });
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}invalidDtoIn`;
    }
  },
  DatetimeListFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd datetime/list failed.";
      this.code = `${Errors.ERROR_PREFIX}datetimeListFailed`;
    }
  },
  NodemailerError: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "An error ocurred while sending email through nodemailer.";
      this.code = `${Errors.ERROR_PREFIX}nodemailerError`;
    }
  },
};

function validateDtoIn(dtoInSchema) {
  const validator = new Validator(dtoInSchema);
  const validationResult = validator.validate("sendNotificationsDtoInType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}

async function loadDatetimeBatch(filters, batchIndex, batchSize) {
  const datetimeListDtoIn = {
    filters: filters,
    withActivity: true,
    pageInfo: {
      pageIndex: batchIndex,
      pageSize: batchSize,
    },
  };
  let datetimeListDtoOut;
  try {
    datetimeListDtoOut = await aktivoClient.cmdGet("datetime/list", datetimeListDtoIn);
  } catch (error) {
    throw new Errors.DatetimeListFailed(dtoOut, {}, error);
  }
  return datetimeListDtoOut;
}

async function sendEmailNotification(transporter, activity, activityId) {
  const { name, members } = activity;
  const receiverEmailList = members.filter((member) => member.email !== null).map((member) => member.email);

  if (receiverEmailList.length === 0) {
    console.warning(`[Activity ${activityId}] No receiver emails found - notifications will not be sent`);
    return;
  }

  try {
    const res = await transporter.sendMail({
      from: '"Aktivo" <aktivo@ethereal.email>',
      to: receiverEmailList.join(","),
      subject: `Aktivo - ${name}`,
      html: emailHtml(`${dtoIn.aktivoClientBaseUri}activity?id=${activityId}`, activity.name),
    });

    console.info(`[Activity ${activityId}] Notifications sent - MessageId: ${res.messageId}`);
  } catch (error) {
    throw new Errors.NodemailerError(dtoOut, { activityId }, error);
  }
}

const { dtoIn, console, session } = scriptContext;
const dtoOut = {};
const INTERVAL = 10 * 60 * 1000; // 10 minutes in ms
let aktivoClient;

async function main() {
  const uuAppErrorMap = validateDtoIn(dtoInSchema);
  aktivoClient = new AppClient({ baseUri: dtoIn.aktivoServerBaseUri, session });

  const TRANSPORTER = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "kadin.fadel@ethereal.email",
      pass: "dNhyMF7TDGqF3SCSuq",
    },
  });

  const dateNow = new Date();
  dateNow.setSeconds(0, 0);
  const loadDatetimeFilters = {
    notification: [new Date(dateNow - INTERVAL).toISOString(), dateNow.toISOString()],
  };

  console.info(`Processing notifications from ${loadDatetimeFilters.notification[0]} to ${loadDatetimeFilters.notification[1]}`);

  const BATCH_SIZE = 100;
  let batchIndex = 0;

  const datetimes = await loadDatetimeBatch(loadDatetimeFilters, batchIndex, BATCH_SIZE);

  if (datetimes.itemList.length === 0) {
    console.info(`No notifications to process - Exiting`);
    return;
  }

  const BATCH_INDEX_MAX = Math.floor(datetimes.pageInfo.total / BATCH_SIZE);
  console.info(`${BATCH_INDEX_MAX + 1} batches to process`);

  console.info(`Processing batch ${batchIndex + 1} of ${BATCH_INDEX_MAX + 1}`);

  await Promise.all(datetimes.itemList.map((datetime) => sendEmailNotification(TRANSPORTER, datetime.activity, datetime.activityId)));

  batchIndex += 1;
  while (batchIndex <= BATCH_INDEX_MAX) {
    const datetimeBatch = await loadDatetimeBatch(loadDatetimeFilters, batchIndex, BATCH_SIZE);
    console.info(`Processing batch ${batchIndex + 1} of ${BATCH_INDEX_MAX + 1}`);
    await Promise.all(datetimeBatch.itemList.map((datetime) => sendEmailNotification(TRANSPORTER, datetime.activity, datetime.activityId)));
    batchIndex += 1;
  }

  console.info("Finished processing batches");
  dtoOut.timeInterval = [loadDatetimeFilters.notification];
  dtoOut.uuAppErrorMap = uuAppErrorMap;
  return dtoOut;
}

main();
