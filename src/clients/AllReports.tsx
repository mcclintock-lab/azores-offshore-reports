import React, { useState } from "react";
import { SegmentControl } from "@seasketch/geoprocessing/client-ui";
import Viability from "./Viability";
import Representation from "./Representation";

const enableAllTabs = false;
const AllReports = () => {
  const [tab, setTab] = useState<string>("Viability");
  return (
    <>
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={["Viability", "Representation"]}
        />
      </div>
      <Viability hidden={!enableAllTabs && tab !== "Viability"} />
      <Representation hidden={!enableAllTabs && tab !== "Representation"} />
    </>
  );
};

export default AllReports;
