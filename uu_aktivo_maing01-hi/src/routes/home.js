//@@viewOn:imports
import { createVisualComponent, Lsi, useCall, useCallback, useRoute, useSession, useState } from "uu5g05";
import { useAlertBus } from "uu_plus4u5g02-elements";
import { Grid, Line } from "uu5g05-elements";
import { CancelButton, SubmitButton } from "uu5g05-forms";
import { withRoute } from "uu_plus4u5g02-app";

import Calls from "../calls.js";

import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";

import WelcomeHeader from "../bricks/welcome-header.js";
import WelcomeContent from "../bricks/welcome-content.js";
import WelcomeQuestions from "../bricks/welcome-questions.js";
import CreateActivityForm from "../bricks/create-activity-form.js";
import FormModal from "../bricks/form-modal.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      marginTop: "16px",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const _Home = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Home",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const { call: createActivity } = useCall(Calls.Activity.create);
    const [, setRoute] = useRoute();
    const { state } = useSession();
    const [modalProps, setModalProps] = useState(null);
    //@@viewOff:private

    const isAuthenticated = state === "authenticated";

    const showModal = useCallback(
      (onSubmit) => {
        setModalProps({
          open: true,
          onClose: () => setModalProps(null),
          onSubmit: onSubmit,
          header: <Lsi lsi={{ en: "Create new activity", cs: "Vytvořit novou aktivitu" }} />,
          footer: (
            <Grid templateColumns={{ xs: "repet(2,1fr)", s: "repeat(2,auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi lsi={{ en: "Create", cs: "Vytvořit" }} />
              </SubmitButton>
            </Grid>
          ),
          children: <CreateActivityForm />,
        });
      },
      [setModalProps],
    );

    const handleCreateActivity = () => {
      if (!isAuthenticated) {
        addAlert({
          priority: "warning",
          header: { en: "Please log in.", cs: "Přihlaste se prosím" },
          message: {
            en: "You need to be logged in to create an activity.",
            cs: "Pro vytvoření aktivity musíte být přihlášeni.",
          },
          durationMs: 3000,
        });
        return;
      }
      showModal(async (e) => {
        e.preventDefault();
        try {
          const activity = await createActivity(e.data.value);
          setModalProps(null);
          addAlert({
            priority: "success",
            header: { en: "New activity created!", cs: "Nová aktivita byla vytvořena!" },
            message: {
              en: `Activity '${activity.name}' was successfully created.`,
              cs: `Aktivita '${activity.name}' byla úspěšně vytvořena.`,
            },
            durationMs: 4000,
          });
          setRoute("my-activities");
        } catch (error) {
          showError(error);
        }
      });
    };

    //@@viewOn:render
    return (
      <div
        style={{
          minHeight: "calc(100vh - 58px)",
        }}
      >
        <Grid
          templateRows={{ xs: "repeat(4, auto)" }}
          templateColumns={{ xs: "100%" }}
          rowGap={{ xs: "16px", m: "48px" }}
          alignItems={{ xs: "start" }}
        >
          <WelcomeHeader />
          <WelcomeContent onCreateActivity={handleCreateActivity} />
          <Line colorScheme="neutral" significance="subdued" margin="0 16px" />
          <WelcomeQuestions />
        </Grid>
        <FormModal {...modalProps} />
      </div>
    );
    //@@viewOff:render
  },
});

const Home = withRoute(_Home, { authenticated: false });

//@@viewOn:exports
export { Home };
export default Home;
//@@viewOff:exports
