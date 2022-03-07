import React from "react";
import { RbcsObjective, YES_COUNT_OBJECTIVE } from "../types/objective";
import { gearTypeScores } from "../helpers/mpaRegBasedClassification";
import { getKeys } from "../helpers/ts";

export interface RbcsObjectiveProps {
  objectives: Record<string, RbcsObjective>;
}

/**
 * Describes RBCS and lists minimum level of protection required for each objective
 */
export const RbcsLearnMore: React.FunctionComponent<RbcsObjectiveProps> = ({
  objectives,
}) => {
  return (
    <>
      <p>
        An MPA counts toward an objective if it meets the minimum level of
        protection for that objective.
      </p>
      <table>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Minimum Level Required</th>
          </tr>
        </thead>
        <tbody>
          {getKeys(objectives).map((objectiveName, index) => {
            return (
              <tr key={index}>
                <td>{objectives[objectiveName].shortDesc}</td>
                <td>
                  {
                    getKeys(objectives[objectiveName].countsToward)[
                      getKeys(objectives[objectiveName].countsToward).findIndex(
                        (level) =>
                          objectives[objectiveName].countsToward[level] !==
                          YES_COUNT_OBJECTIVE
                      ) - 1
                    ]
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        To increase the protection level and achieve the objective, you must
        changed the allowed uses of your plan to reduce the impact score.
      </p>
      <p>
        {" "}
        A protection level is assigned to each MPA or zone within an MPA based
        on 1) the number of fishing gears allowed, 2) the highest impact fishing
        gear and 3) the impact of allowed aquaculture/bottom exploitation. For
        no-take zones, a fourth criteria is added, the impact of allowed
        boating/anchoring. The higher the impact of the allowed uses in a given
        MPA or Zone, the lower the classification.
      </p>

      <b>Zone Classification</b>
      <p>
        Zones are assigned 1 of 8 <em>zone classifications</em>. If users can
        create MPA's but not Zones, then they will be scored as a single Zone
        MPA. The Zone classification is assigned based on 4 criteria:
      </p>
      <ol>
        <li>Number of fishing gear types</li>
        <li>Fishing gear impact</li>
        <li>Allowed aquaculture / bottom exploitation</li>
        <li>Allowed boating / anchoring</li>
      </ol>
      <p>Zones are classified based on the following decision tree:</p>
      <p>
        <img
          src={require("../assets/img/zone_classification.png")}
          style={{ maxWidth: "100%" }}
        />
        <a
          target="_blank"
          href="https://www.sciencedirect.com/science/article/pii/S0308597X16300197"
        >
          image source
        </a>
      </p>
      <p>The impact score each each allowed activity is as follows:</p>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Impact score</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(gearTypeScores).map((gearType, index) => {
            return (
              <tr key={index}>
                <td>{gearType}</td>
                <td>{gearTypeScores[gearType]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <b>MPA Classification</b>
      <p>
        MPA Network plans are assigned 1 of 5 <em>MPA classifications</em>. This
        MPA classification is based on an index score, which is derived from the
        zone classification of each MPA and the size of the MPA relative to the
        overall network area. The larger An MPAs area proportional to the total,
        the more weight it carries in the index score.
      </p>
      <p>
        <img
          src={require("../assets/img/mpa_classification.png")}
          style={{ maxWidth: "100%" }}
        />
        (
        <a
          target="_blank"
          href="https://www.sciencedirect.com/science/article/pii/S0308597X16300197"
        >
          image source
        </a>
        )
      </p>
      <p>
        This system of assigning protection based on perceived impact is called
        the{" "}
        <a target="_blank" href="https://doi.org/10.1016/j.marpol.2016.06.021">
          regulation-based classification system
        </a>
        (RBCS). To learn more, please read the original published research
        paper:
      </p>
      <p>
        Bárbara Horta e Costa, Joachim Claudet, Gustavo Franco, Karim Erzini,
        Anthony Caro, Emanuel J. Gonçalves, A regulation-based classification
        system for Marine Protected Areas (MPAs), Marine Policy, Volume 72,
        2016, Pages 192-198, ISSN 0308-597X.
        https://doi.org/10.1016/j.marpol.2016.06.021
      </p>
    </>
  );
};
