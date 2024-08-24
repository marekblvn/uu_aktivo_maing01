//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Button, Grid, Line, PlaceholderBox, Skeleton } from "uu5g05-elements";
import DateBlock from "./date-block.js";
import UserStatusBlock from "./user-status-block.js";
import ParticipationStatusBlock from "./participation-status-block.js";
import { Error, useAlertBus } from "uu_plus4u5g02-elements";
import DatetimeProvider from "../providers/datetime-provider.js";
import importLsi from "../lsi/import-lsi.js";
import CreateDatetimeForm from "./create-datetime-form.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import ParticipationBlock from "./participation-block.js";
import { CancelButton, SubmitButton } from "uu5g05-forms";
import FormModal from "./form-modal.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  listItem: (props) =>
    Config.Css.css({
      display: "grid",
      padding: 0,
      borderRadius: "8px",
    }),
  text: (props) =>
    Config.Css.css({
      padding: "16px 16px 16px 24px",
      backgroundColor: "rgba(117, 117, 117, 0.08)",
      borderTopRightRadius: "8px",
      borderTopLeftRadius: "8px",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const DatetimeDetail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DatetimeDetail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onUpdateParticipation: () => {},
    idealParticipants: 0,
    minParticipants: 0,
  },
  //@@viewOff:defaultProps

  render({ idealParticipants, minParticipants, datetimeId, activityId, onReload }) {
    //@@viewOn:private
    const { identity } = useSession();
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noDatetime"] });
    const [modalOpen, setModalOpen] = useState(false);
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner } = useActivityAuthorization();
    //@@viewOff:private

    function renderLoading() {
      return (
        <div style={{ width: "100%", height: "400px" }}>
          <Skeleton width="100%" height="100%" borderRadius="moderate" />
        </div>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          const errorCode = errorData.error?.code;
          return (
            <Error
              title={errorLsi[errorCode]?.header || { en: "Something went wrong", cs: "Něco se pokazilo" }}
              subtitle={errorLsi[errorCode]?.message || errorData.error?.code}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data, handlerMap) {
      const handleCreateDatetime = async ({ value }) => {
        try {
          const createdDatetime = await handlerMap.create({ activityId, ...value });
          setModalOpen(false);
          const formattedDatetime = new Date(createdDatetime.datetime).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          });
          addAlert({
            priority: "success",
            header: { en: "New datetime was successfully created!", cs: "Nový termín by úspěšně vytvořen!" },
            message: {
              en: `Every member can now update their participation until ${formattedDatetime}.`,
              cs: `Každý člen může nyní změnit svoji účast do ${formattedDatetime}.`,
            },
          });
          await onReload(activityId);
        } catch (error) {
          showError(error);
        }
      };

      if (!data)
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlaceholderBox code="calendar" header={placeholderLsi.header} style={{ padding: "16px" }} />
            {(isOwner || isAuthority || isExecutive) && (
              <Button
                style={{ maxWidth: "200px" }}
                colorScheme="secondary"
                significance="common"
                icon="mdi-calendar-plus-outline"
                onClick={() => setModalOpen(true)}
              >
                <Lsi lsi={{ en: "Create new datetime", cs: "Vytvořit nový termín" }} />
              </Button>
            )}
            <CreateDatetimeForm open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateDatetime} />
          </div>
        );

      const { id, datetime, undecided, confirmed, denied } = data;

      const currentUserParticipationType = (() => {
        if (confirmed.includes(identity.uuIdentity)) return "confirmed";
        if (denied.includes(identity.uuIdentity)) return "denied";
        return "undecided";
      })();

      const filteredConfirmed = confirmed.filter((i) => i !== identity.uuIdentity);
      const filteredUndecided = undecided.filter((i) => i !== identity.uuIdentity);
      const filteredDenied = denied.filter((i) => i !== identity.uuIdentity);

      const handleChangeParticipation = async (type) => {
        try {
          await handlerMap.updateParticipation({ id, type });
        } catch (error) {
          showError(error);
        }
      };

      return (
        <Grid templateRows={{ xs: "repeat(3,1fr) auto" }} rowGap={{ xs: "8px", m: "12px" }}>
          <DateBlock datetime={datetime} />
          <ParticipationStatusBlock
            idealParticipants={idealParticipants}
            minParticipants={minParticipants}
            confirmedCount={confirmed.length}
            deniedCount={denied.length}
            undecidedCount={undecided.length}
          />
          <UserStatusBlock
            onChangeParticipation={handleChangeParticipation}
            userParticipationType={currentUserParticipationType}
          />
          <Line colorScheme="neutral" significance="subdued" />
          <ParticipationBlock
            items={{ confirmed: filteredConfirmed, undecided: filteredUndecided, denied: filteredDenied }}
          />
        </Grid>
      );
    }

    //@@viewOn:render
    return (
      <DatetimeProvider datetimeId={datetimeId}>
        {({ state, data, pendingData, errorData, handlerMap }) => {
          switch (state) {
            case "pending":
              return renderReady(data, handlerMap);
            case "pendingNoData":
              return renderLoading();
            case "error":
              return renderReady(data, handlerMap);
            case "errorNoData":
              return renderError(errorData);
            case "ready":
            case "readyNoData":
              return renderReady(data, handlerMap);
          }
        }}
      </DatetimeProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeDetail };
export default DatetimeDetail;
//@@viewOff:exports
