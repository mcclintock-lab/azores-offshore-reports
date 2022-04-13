import React, { useState } from "react";
import { SegmentControl } from "@seasketch/geoprocessing/client-ui";
import Viability from "./Viability";
import Representation from "./Representation";
import KeyResources from "./KeyResources";
import KeyAreas from "./KeyAreas";

const enableAllTabs = false;
const AllReports = () => {
  const [tab, setTab] = useState<string>("Viability");
  return (
    <>
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={[
            "Viability",
            "Representation",
            "Key Resources",
            "Key Areas",
          ]}
        />
      </div>
      <Viability hidden={!enableAllTabs && tab !== "Viability"} />
      <Representation hidden={!enableAllTabs && tab !== "Representation"} />
      <KeyResources hidden={!enableAllTabs && tab !== "Key Resources"} />
      <KeyAreas hidden={!enableAllTabs && tab !== "Key Areas"} />
    </>
  );
};

export default AllReports;
