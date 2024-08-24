//@@viewOn:imports
import {
  createVisualComponent,
  Lsi,
  useCall,
  useCallback,
  useRoute,
  useScreenSize,
  useSession,
  useState,
} from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { Dialog, Grid, Line } from "uu5g05-elements";
import UpdateActivityForm from "./update-activity-form.js";
import UpdateFrequencyForm from "./update-frequency-form.js";
import ActivitySettingsBlock from "./activity-settings-block.js";
import DatetimeSettingsBlock from "./datetime-settings-block.js";
import UpdateNotificationOffsetForm from "./update-notification-offset-form.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
import importLsi from "../lsi/import-lsi.js";
import Calls from "../calls.js";
import TransferOwnershipForm from "./transfer-ownership-form.js";
import { CancelButton, ResetButton, SubmitButton } from "uu5g05-forms";
import FormModal from "./form-modal.js";
//@@viewOff:imports

//@@viewOn:constants
const UC_COLOR_SCHEME = {
  deleteActivity: "negative",
  deleteDatetime: "negative",
  changeRecurrence: "warning",
};
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const ActivitySettingsView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivitySettingsView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({
    id,
    name,
    description,
    location,
    minParticipants,
    idealParticipants,
    members,
    datetimeId,
    frequency,
    notificationOffset,
    recurrent,
    onUpdateActivity,
    onTransferOwnership,
    onDeleteActivity,
    onChangeRecurrence,
    onUpdateFrequency,
    onUpdateNotificationOffset,
    onReload,
  }) {
    //@@viewOn:private
    const { identity } = useSession();
    const [, setRoute] = useRoute();
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const { call: callDatetimeDelete } = useCall(Calls.Datetime.delete);
    //@@viewOff:private

    const showDialog = useCallback(
      (useCase, onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", useCase, "header"]} />,
          info: <Lsi import={importLsi} path={["Dialog", useCase, "info"]} />,
          icon: "mdi-delete",
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", useCase, "confirm"]} />,
              colorScheme: UC_COLOR_SCHEME[useCase],
              onClick: onConfirm,
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showModal = useCallback(
      (useCase, children, onSubmit) => {
        setModalProps({
          open: true,
          onClose: () => setModalProps(null),
          onSubmit: onSubmit,
          header: <Lsi import={importLsi} path={["Forms", useCase, "header"]} />,
          footer: (
            <Grid
              templateColumns={{
                xs: `${useCase === "transferOwnership" ? "" : "auto"} repeat(2, 1fr)`,
                s: `repeat(${useCase === "transferOwnership" ? 2 : 3}, auto)`,
              }}
              justifyContent={{ xs: "center", s: "end" }}
            >
              {useCase !== "transferOwnership" ? <ResetButton icon="uugds-refresh" significance="subdued" /> : null}
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi import={importLsi} path={["Forms", useCase, "submit"]} />
              </SubmitButton>
            </Grid>
          ),
          children,
        });
      },
      [setModalProps],
    );

    const handleDeleteDatetime = () => {
      showDialog("deleteDatetime", async () => {
        try {
          await callDatetimeDelete({ id: datetimeId });
          setDialogProps(null);
          await onReload(id);
          addAlert({
            priority: "info",
            header: { en: "Datetime was deleted", cs: "Termín byl smazán" },
            message: { en: "The datetime was successfully deleted.", cs: "Termín byl úspěšně smazán." },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleDeleteActivity = () => {
      showDialog("deleteActivity", async () => {
        try {
          await onDeleteActivity(id);
          setDialogProps(null);
          addAlert({
            priority: "info",
            header: { en: "Activity deleted", cs: "Aktivita smazána" },
            message: { en: "The activity was successfully deleted.", cs: "Aktivita byla úspěšně smazána." },
            durationMs: 2000,
          });
          setRoute("my-activities");
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleUpdateActivity = () =>
      showModal(
        "updateActivity",
        <UpdateActivityForm initialValues={{ name, description, location, minParticipants, idealParticipants }} />,
        async ({ data }) => {
          try {
            await onUpdateActivity(data);
            setModalProps(null);
            addAlert({
              priority: "info",
              header: { en: "Activity settings edited", cs: "Nastavení aktivity upraveno" },
              message: { en: "Changes you made were successfully saved.", cs: "Provedené změny byly úspěšně uloženy." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        },
      );

    const handleTransferOwnership = () => {
      const filteredMembers = members.filter((i) => i !== identity.uuIdentity);
      showModal("transferOwnership", <TransferOwnershipForm members={filteredMembers} />, async ({ data }) => {
        delete data.value.consent;
        try {
          await onTransferOwnership(data);
          setModalProps(null);
          addAlert({
            priority: "info",
            header: { en: "Activity ownership transferred", cs: "Vlastnictví aktivity převedeno" },
            message: {
              en: "The ownership of the activity was successfully transferred.",
              cs: "Vlastnictví aktivity bylo úspěšně převedeno.",
            },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleChangeRecurrence = () => {
      showDialog("changeRecurrence", async () => {
        try {
          await onChangeRecurrence();
          setDialogProps(null);
          addAlert({
            priority: "info",
            header: { en: "Functionality not yet implemented" },
            message: { en: "Ignore this alert. No changes were made." },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleUpdateFrequency = () =>
      showModal(
        "updateFrequency",
        <UpdateFrequencyForm initialValues={frequency} notificationOffset={notificationOffset} />,
        async ({ data }) => {
          try {
            await onUpdateFrequency(data);
            setModalProps(null);
            addAlert({
              priority: "info",
              header: {
                en: "Frequency changed",
                cs: "Frekvence změněna",
              },
              message: { en: "Changes you made were successfully saved.", cs: "Provedené změny byly úspěšně uloženy." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        },
      );

    const handleUpdateNotificationOffset = () =>
      showModal(
        "updateNotificationOffset",
        <UpdateNotificationOffsetForm initialValues={notificationOffset} frequency={frequency} />,
        async ({ data }) => {
          try {
            await onUpdateNotificationOffset(data);
            setModalProps(null);
            addAlert({
              priority: "info",
              header: {
                en: "Notification offset changed",
                cs: "Posun upozornění změněn",
              },
              message: { en: "Changes you made were successfully saved.", cs: "Provedené změny byly úspěšně uloženy." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        },
      );

    //@@viewOn:render
    return (
      <Container
        style={{
          width: "auto",
          padding: "16px 24px 10px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          height: "100%",
        }}
      >
        <ActivitySettingsBlock
          data={{ name, description, location, minParticipants, idealParticipants, members, datetimeId }}
          onClickEdit={handleUpdateActivity}
          onClickTransferOwnership={handleTransferOwnership}
          onClickDeleteActivity={handleDeleteActivity}
        />
        <Line direction="horizontal" colorScheme="building" significance="subdued" margin="16px 0" />
        <DatetimeSettingsBlock
          datetimeId={datetimeId}
          recurrent={recurrent}
          frequency={frequency}
          notificationOffset={notificationOffset}
          onChangeRecurrence={handleChangeRecurrence}
          onEditFrequency={handleUpdateFrequency}
          onEditNotificationOffset={handleUpdateNotificationOffset}
          onDeleteDatetime={handleDeleteDatetime}
        />
        {/* </Grid> */}
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} />
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivitySettingsView };
export default ActivitySettingsView;
//@@viewOff:exports
