import React from "react";

export const RbcsLearnMore = () => {
  return (
    <>
      <p>
        {" "}
        This project categorizes plans using a{" "}
        <a target="_blank" href="https://doi.org/10.1016/j.marpol.2016.06.021">
          regulation-based classification system
        </a>
        , where activities are scored based on their potential impact to
        biodiversity. The higher the potential impact of the allowed uses in a
        given MPA or Network, the lower the classification.
      </p>
      <p>To learn more please read the original published research paper:</p>
      <p>
        Bárbara Horta e Costa, Joachim Claudet, Gustavo Franco, Karim Erzini,
        Anthony Caro, Emanuel J. Gonçalves, A regulation-based classification
        system for Marine Protected Areas (MPAs), Marine Policy, Volume 72,
        2016, Pages 192-198, ISSN 0308-597X.
        https://doi.org/10.1016/j.marpol.2016.06.021
      </p>
      <b>Zone Classification</b>
      <p>
        Individual MPAs are assigned 1 of 8 <em>zone classifications</em>. The
        classification assigned is based on 4 criteria:
      </p>
      <ol>
        <li>Number of fishing gear types</li>
        <li>Fishing gear impact</li>
        <li>Allowed aquaculture / bottom exploitation</li>
        <li>Allowed boating / anchoring</li>
      </ol>
      <p>Scoring is based on the allowed activities and is as follows:</p>
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
      <p>
        To improve the classification of an MPA or network, one must change the
        allowed activities in a way that reduces the potential impact.
      </p>
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
    </>
  );
};
