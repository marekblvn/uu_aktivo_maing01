//@@viewOn:imports
import { createVisualComponent, Lsi, useEffect, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, Grid, ScrollableBox } from "uu5g05-elements";
import AttendanceItem from "./attendance-item.js";
import AttendanceListHeader from "./attendance-list-header.js";
import SaveAttendanceModal from "./save-attendance-modal.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  firstCol: () =>
    Config.Css.css({
      backgroundColor: "rgba(0,0,0,0.02)",
      padding: "8px 0 8px 16px",
      borderBottom: "solid 1px rgba(0,0,0,0.4)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
    }),
  nthCol: (position) =>
    Config.Css.css({
      backgroundColor: `${position % 2 === 0 ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0)"}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: "solid 1px rgba(0,0,0,0.4)",
      fontWeight: 700,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const AttendanceList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ itemList, dateRange }) {
    const [screenSize] = useScreenSize();
    const [modalOpen, setModalOpen] = useState(false);
    //@@viewOff:private

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    useEffect(() => {
      handleCloseModal();
    }, [screenSize]);

    //@@viewOn:render
    function renderItems(items) {
      return items.map((item, index) => <AttendanceItem key={index} data={item} />);
    }
    return (
      <>
        {["xl", "l"].includes(screenSize) && (
          <ActionGroup
            style={{ marginBottom: "8px" }}
            alignment="left"
            itemList={[
              {
                icon: "mdi-content-save-outline",
                children: <Lsi lsi={{ en: "Save attendance", cs: "Uložit docházku" }} />,
                colorScheme: "neutral",
                onClick: handleOpenModal,
              },
            ]}
          />
        )}
        <Box>
          <Grid templateRows={{ xs: `"repeat(${itemList.length + 1}, 1fr)"` }} rowGap={0}>
            <AttendanceListHeader />
            <ScrollableBox maxHeight={["xl", "l"].includes(screenSize) ? 624 : screenSize === "m" ? 610 : 594}>
              {renderItems(itemList)}
            </ScrollableBox>
          </Grid>
          <SaveAttendanceModal
            open={modalOpen}
            onClose={handleCloseModal}
            initialFilename={`${dateRange.after}_${dateRange.before}`}
          >
            <Grid templateRows={{ xs: `"repeat(${itemList.length + 1}, 1fr)"` }} rowGap={0}>
              <AttendanceListHeader />
              {renderItems(itemList)}
            </Grid>
          </SaveAttendanceModal>
        </Box>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceList };
export default AttendanceList;
//@@viewOff:exports
