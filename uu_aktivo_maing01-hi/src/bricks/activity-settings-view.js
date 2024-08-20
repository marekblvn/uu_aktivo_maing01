//@@viewOn:imports
import { createVisualComponent, Lsi, useCall, useCallback, useRoute, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { Dialog, Line } from "uu5g05-elements";
import UpdateActivitySettingsModal from "./update-activity-settings-modal.js";
import UpdateFrequencyModal from "./update-frequency-modal.js";
import ActivitySettingsBlock from "./activity-settings-block.js";
import DatetimeSettingsBlock from "./datetime-settings-block.js";
import UpdateNotificationOffsetModal from "./update-notification-offset-modal.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
import importLsi from "../lsi/import-lsi.js";
import Calls from "../calls.js";
import TransferOwnershipModal from "./transfer-ownership-modal.js";
//@@viewOff:imports

//@@viewOn:constants
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
    onUpdateActivityInfo,
    onTransferOwnership,
    onDeleteActivity,
    onChangeRecurrence,
    onUpdateFrequency,
    onUpdateNotificationOffset,
    onReload,
  }) {
    //@@viewOn:private
    const [, setRoute] = useRoute();
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [activitySettingsFormOpen, setActivitySettingsFormOpen] = useState(false);
    const [transferOwnershipFormOpen, setTransferOwnershipFormOpen] = useState(false);
    const [frequencyFormOpen, setFrequencyFormOpen] = useState(false);
    const [notificationOffsetFormOpen, setNotificationOffsetFormOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState();
    const { call: callDatetimeDelete } = useCall(Calls.Datetime.delete);
    //@@viewOff:private

    const handleOpenActivitySettingsForm = () => setActivitySettingsFormOpen(true);
    const handleCloseActivitySettingsForm = () => setActivitySettingsFormOpen(false);

    const handleOpenFrequencyForm = () => setFrequencyFormOpen(true);
    const handleCloseFrequencyForm = () => setFrequencyFormOpen(false);

    const handleOpenNotificationOffsetForm = () => setNotificationOffsetFormOpen(true);
    const handleCloseNotificationOffsetForm = () => setNotificationOffsetFormOpen(false);

    const handleOpenTransferOwnershipForm = () => setTransferOwnershipFormOpen(true);
    const handleCloseTransferOwnershipForm = () => setTransferOwnershipFormOpen(false);

    const showChangeRecurrenceDialog = useCallback((onConfirm) => {
      setDialogProps({
        header: (
          <Lsi
            lsi={{ en: "Are you sure you want to change this setting?", cs: "Opravdu chcete změnit toto nastavení?" }}
          />
        ),
        info: (
          <Lsi
            lsi={{
              en: "This will prevent the activity from periodically creating the next datetime. After the upcoming datetime passes, the activity will not have a datetime assigned.",
              cs: "Změnou tohoto nastavení zabráníte aktivitě v pravidelném vytváření dalšího termínu. Po uplynutí nadcházejícího termínu nebude mít aktivita přiřazený žádný termín.",
            }}
          />
        ),

        icon: "mdi-calendar-refresh",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: handleCloseDialog,
          },
          {
            children: <Lsi lsi={{ en: "Change", cs: "Změnit" }} />,
            colorScheme: "warning",
            onClick: onConfirm,
          },
        ],
      });
    }, []);

    const showDeleteDatetimeDialog = useCallback((onConfirm) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", "deleteDatetime", "header"]} />,
        info: <Lsi import={importLsi} path={["Dialog", "deleteDatetime", "info"]} />,
        icon: "mdi-delete",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: handleCloseDialog,
          },
          {
            children: <Lsi import={importLsi} path={["Dialog", "deleteDatetime", "submit"]} />,
            colorScheme: "negative",
            onClick: onConfirm,
          },
        ],
      });
    });

    const showDeleteActivityDialog = useCallback((onConfirm) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", "deleteActivity", "header"]} />,
        info: <Lsi import={importLsi} path={["Dialog", "deleteActivity", "info"]} />,
        icon: "mdi-delete",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: handleCloseDialog,
          },
          {
            children: <Lsi import={importLsi} path={["Dialog", "deleteActivity", "submit"]} />,
            colorScheme: "negative",
            onClick: onConfirm,
          },
        ],
      });
    });

    const handleCloseDialog = () => setDialogProps(null);

    const handleDeleteDatetime = () => {
      showDeleteDatetimeDialog(async () => {
        try {
          await callDatetimeDelete({ id: datetimeId });
          handleCloseDialog();
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
      showDeleteActivityDialog(async () => {
        try {
          await onDeleteActivity(id);
          handleCloseDialog();
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

    const handleUpdateActivityInfo = async ({ data }) => {
      try {
        await onUpdateActivityInfo(data);
        handleCloseActivitySettingsForm();
        addAlert({
          priority: "info",
          header: { en: "Activity settings edited", cs: "Nastavení aktivity upraveno" },
          message: { en: "Changes you made were successfully saved.", cs: "Provedené změny byly úspěšně uloženy." },
          durationMs: 2000,
        });
      } catch (error) {
        showError(error);
      }
    };

    const handleTransferOwnership = async ({ data }) => {
      delete data.value.consent;
      try {
        await onTransferOwnership(data);
        handleCloseTransferOwnershipForm();
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
    };

    const handleChangeRecurrence = () => {
      showChangeRecurrenceDialog(async () => {
        try {
          await onChangeRecurrence();
          handleCloseDialog();
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

    const handleUpdateFrequency = async ({ data }) => {
      try {
        await onUpdateFrequency(data);
        handleCloseFrequencyForm();
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
        showError(error, { displayDetailButton: false });
      }
    };

    const handleUpdateNotificationOffset = async ({ data }) => {
      try {
        await onUpdateNotificationOffset(data);
        handleCloseNotificationOffsetForm();
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
        showError(error, { displayDetailButton: false });
      }
    };

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
          onClickEdit={handleOpenActivitySettingsForm}
          onClickTransferOwnership={handleOpenTransferOwnershipForm}
          onClickDeleteActivity={handleDeleteActivity}
        />
        <Line direction="horizontal" colorScheme="building" significance="subdued" />
        <DatetimeSettingsBlock
          datetimeId={datetimeId}
          recurrent={recurrent}
          frequency={frequency}
          notificationOffset={notificationOffset}
          onChangeRecurrence={handleChangeRecurrence}
          onEditFrequency={handleOpenFrequencyForm}
          onEditNotificationOffset={handleOpenNotificationOffsetForm}
          onDeleteDatetime={handleDeleteDatetime}
        />
        {/* </Grid> */}
        <Dialog {...dialogProps} open={!!dialogProps} onClose={handleCloseDialog} />
        <UpdateActivitySettingsModal
          open={activitySettingsFormOpen}
          onClose={handleCloseActivitySettingsForm}
          initialValues={{ name, description, location, minParticipants, idealParticipants }}
          onSubmit={handleUpdateActivityInfo}
        />
        <UpdateFrequencyModal
          open={frequencyFormOpen}
          onClose={handleCloseFrequencyForm}
          initialValues={frequency}
          activityId={id}
          notificationOffset={notificationOffset}
          onSubmit={handleUpdateFrequency}
        />
        <UpdateNotificationOffsetModal
          open={notificationOffsetFormOpen}
          onClose={handleCloseNotificationOffsetForm}
          initialValues={notificationOffset}
          activityId={id}
          frequency={frequency}
          onSubmit={handleUpdateNotificationOffset}
        />
        <TransferOwnershipModal
          open={transferOwnershipFormOpen}
          onClose={handleCloseTransferOwnershipForm}
          members={members}
          onSubmit={handleTransferOwnership}
        />
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivitySettingsView };
export default ActivitySettingsView;
//@@viewOff:exports
