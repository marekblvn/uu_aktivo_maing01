//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { Dialog, Grid } from "uu5g05-elements";
import UpdateActivityInformationModal from "./update-activity-information-modal.js";
import UpdateFrequencyModal from "./update-frequency-modal.js";
import ActivityInformationBlock from "./activity-information-block.js";
import DatetimeSettingsBlock from "./datetime-settings-block.js";
import UpdateNotificationOffsetModal from "./update-notification-offset-modal.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
import importLsi from "../lsi/import-lsi.js";
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
    datetimeId,
    frequency,
    notificationOffset,
    recurrent,
    onUpdateActivityInfo,
    onChangeRecurrence,
    onUpdateFrequency,
    onUpdateNotificationOffset,
  }) {
    //@@viewOn:private
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [informationFormOpen, setInformationFormOpen] = useState(false);
    const [frequencyFormOpen, setFrequencyFormOpen] = useState(false);
    const [notificationOffsetFormOpen, setNotificationOffsetFormOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState();
    //@@viewOff:private

    const handleOpenInformationForm = () => setInformationFormOpen(true);
    const handleCloseInformationForm = () => setInformationFormOpen(false);

    const handleOpenFrequencyForm = () => setFrequencyFormOpen(true);
    const handleCloseFrequencyForm = () => setFrequencyFormOpen(false);

    const handleOpenNotificationOffsetForm = () => setNotificationOffsetFormOpen(true);
    const handleCloseNotificationOffsetForm = () => setNotificationOffsetFormOpen(false);

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
              en: "This will prevent the activity from periodically creating the next date. After the upcoming date passes, the activity will not have a date assigned.",
              cs: "Změnou tohoto nastavení zabráníte aktivitě v pravidelném vytváření dalšího data. Po uplynutí nadcházejícího data nebude mít aktivita přiřazené žádné datum.",
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
    const handleCloseDialog = () => setDialogProps(null);

    const handleUpdateActivityInfo = async ({ data }) => {
      try {
        await onUpdateActivityInfo(data);
        handleCloseInformationForm();
        addAlert({
          priority: "info",
          header: { en: "Activity information updated", cs: "Informace aktivity upraveny" },
          message: { en: "Changes you made were successfully saved.", cs: "Provedené změny byly úspěšně uloženy." },
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
            cs: "Posun oznámení změněn",
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
          padding: "8px 8px 10px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Grid rowGap="12px">
          {/* Activity settings */}
          <ActivityInformationBlock
            data={{ name, description, location, minParticipants, idealParticipants }}
            onClickEdit={handleOpenInformationForm}
          />
          {/* Datetime settings */}
          <DatetimeSettingsBlock
            datetimeId={datetimeId}
            recurrent={recurrent}
            frequency={frequency}
            notificationOffset={notificationOffset}
            onChangeRecurrence={handleChangeRecurrence}
            onEditFrequency={handleOpenFrequencyForm}
            onEditNotificationOffset={handleOpenNotificationOffsetForm}
          />
        </Grid>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={handleCloseDialog} />
        <UpdateActivityInformationModal
          open={informationFormOpen}
          onClose={handleCloseInformationForm}
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
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivitySettingsView };
export default ActivitySettingsView;
//@@viewOff:exports
