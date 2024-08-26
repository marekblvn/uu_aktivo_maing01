//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Box, Grid, Icon, Line, Number, Text } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
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

const AttendanceTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data } = props;
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Box shape="ground" borderRadius="moderate" style={{ padding: screenSize === "xs" ? "8px" : "16px" }}>
        <Grid
          templateColumns={{ xs: "auto" }}
          templateRows={{ xs: "100%" }}
          alignItems={{ xs: "center" }}
          justifyContent={{ xs: "space-between" }}
          style={{ padding: screenSize === "xs" ? "8px 12px" : "16px 24px" }}
        >
          <PersonItem uuIdentity={data.uuIdentity} />
        </Grid>
        <Line colorScheme="building" significance="subdued" />
        <Grid
          rowGap={{ xs: "8px", s: "16px" }}
          style={{
            padding: screenSize === "xs" ? "8px" : "16px",
            marginTop: "4px",
            fontSize: screenSize === "xs" ? "13px" : "16px",
          }}
        >
          <Grid templateAreas={{ xs: `l l l l l l count count count perc perc perc` }} alignItems="center">
            <Grid.Item gridArea="l" colSpan={6} rowSpan={1}>
              <Text>
                <Icon icon="uugdsstencil-communication-thumb-up" colorScheme="positive" margin="0 4px" />
                <Lsi lsi={{ en: "Came", cs: "Přišel(a)" }} />
              </Text>
            </Grid.Item>
            <Grid.Item gridArea="count" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                <Number value={data.confirmed} />
              </div>
            </Grid.Item>
            <Grid.Item gridArea="perc" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                {"("}
                <Number
                  value={data.confirmedPercentage}
                  unit="percent"
                  roundingMode="halfExpand"
                  roundingPosition={-1}
                  maxDecimalDigits={1}
                />
                {")"}
              </div>
            </Grid.Item>
          </Grid>
          <Grid templateAreas={{ xs: `l l l l l l count count count perc perc perc` }} alignItems="center">
            <Grid.Item gridArea="l" colSpan={6} rowSpan={1}>
              <Text>
                <Icon icon="uugds-help" colorScheme="neutral" margin="0 4px" />
                <Lsi lsi={{ en: "Didn't decide", cs: "Nerozhodl(a) se" }} />
              </Text>
            </Grid.Item>
            <Grid.Item gridArea="count" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                <Number value={data.undecided} />
              </div>
            </Grid.Item>
            <Grid.Item gridArea="perc" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                {"("}
                <Number
                  value={data.undecidedPercentage}
                  unit="percent"
                  roundingMode="halfExpand"
                  roundingPosition={-1}
                  maxDecimalDigits={1}
                />
                {")"}
              </div>
            </Grid.Item>
          </Grid>
          <Grid templateAreas={{ xs: `l l l l l l count count count perc perc perc` }} alignItems="center">
            <Grid.Item gridArea="l" colSpan={6} rowSpan={1}>
              <Text>
                <Icon icon="uugdsstencil-communication-thumb-down" colorScheme="negative" margin="0 4px" />
                <Lsi lsi={{ en: "Didn't come", cs: "Nepřišel(a)" }} />
              </Text>
            </Grid.Item>
            <Grid.Item gridArea="count" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                <Number value={data.denied} />
              </div>
            </Grid.Item>
            <Grid.Item gridArea="perc" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                {"("}
                <Number
                  value={data.deniedPercentage}
                  unit="percent"
                  roundingMode="halfExpand"
                  roundingPosition={-1}
                  maxDecimalDigits={1}
                />
                {")"}
              </div>
            </Grid.Item>
          </Grid>
          <Line colorScheme="neutral" significance="subdued" />
          <Grid templateAreas={{ xs: `l l l l l l count count count perc perc perc` }} alignItems="center">
            <Grid.Item gridArea="l" colSpan={6} rowSpan={1}>
              <Text>
                <Icon icon="uugdsstencil-commerce-sum" margin="0 4px" />
                <Lsi lsi={{ en: "Datetimes as member", cs: "Termínů členem" }} />
              </Text>
            </Grid.Item>
            <Grid.Item gridArea="count" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                <Number value={data.denied + data.confirmed + data.undecided} />
              </div>
            </Grid.Item>
            <Grid.Item gridArea="perc" colSpan={3} rowSpan={1}>
              <div style={{ textAlign: "right" }}>
                {"("}
                <Number
                  value={((data.denied + data.confirmed + data.undecided) / data.total) * 100}
                  unit="percent"
                  roundingMode="halfExpand"
                  roundingPosition={-1}
                  maxDecimalDigits={1}
                />
                {")"}
              </div>
            </Grid.Item>
          </Grid>
        </Grid>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceTile };
export default AttendanceTile;
//@@viewOff:exports
