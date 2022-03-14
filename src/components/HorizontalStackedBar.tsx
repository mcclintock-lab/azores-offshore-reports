import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import React from "react";
import styled from "styled-components";

export interface StyledHorizontalStackedBarProps {
  rowTotals: number[];
  blockGroupColors: (string | undefined)[];
  target?: number;
}

const StyledHorizontalStackedBar = styled.div<StyledHorizontalStackedBarProps>`
  h3,
  h6 {
    margin: 0;
    line-height: 1em;
  }
  h3 {
    margin-bottom: 1em;
  }
  h6 {
    font-size: 0.8em;
    padding: 0 0.5em 0.5em 0;
    width: 6em;
    text-align: right;
    color: #666;
  }
  figure {
    margin: 2em auto 2em auto;
    max-width: 1100px;
    position: relative;
  }
  .graphic {
    padding-left: 10px;
  }
  .row {
    margin-bottom: 1em;
    display: flex;
    align-items: center;
  }
  @keyframes expand {
    from {
      width: 0%;
    }
    to {
      width: calc(100% - 5em);
    }
  }
  @media screen and (min-width: 768px) {
    @keyframes expand {
      from {
        width: 0%;
      }
      to {
        width: calc(100% - 5em);
      }
    }
  }
  .chart {
    position: relative;
    overflow: visible;
    width: 0%;
    animation: expand 1.5s ease forwards;
  }

  .row + .row .chart {
    animation-delay: 0.2s;
  }
  .row + .row + .row .chart {
    animation-delay: 0.4s;
  }
  .block.yes {
    outline: 1px solid #999;
  }
  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    color: #333;
    font-size: 0.75em;
    float: left;
    background-color: #999;
    position: relative;
    overflow: hidden;
    opacity: 1;
    transition: opacity, 0.3s ease;
    cursor: pointer;
  }

  .block:hover {
    opacity: 0.65;
  }

  .x-axis {
    text-align: center;
    padding: 0.5em 0 2em;
  }

  .legend {
    margin: 0 auto;
    padding: 0;
    font-size: 0.9em;
  }
  .legend li {
    display: inline-block;
    padding: 0.25em 0.8em;
    line-height: 1em;
  }
  .legend li:before {
    content: "";
    margin-right: 0.5em;
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #334d5c;
  }

  .zero-marker {
    position: absolute;
    left: 0;
    height: 46px;
    width: 1.5px;
    background-color: #aaa;
    top: -8px;
  }

  ${(props) =>
    props.rowTotals.map(
      (total, index) =>
        `
        .row-${index} .total-label {
          position: absolute;
          left: ${total + 0.75}%;
          width: 100px;
          font-size: 0.9em;
          text-shadow: 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF;
          font-weight: bold;
          color: #666;
          height: 30px;
          display: flex;
          align-items: center;
        }
    `
    )}

  ${(props) =>
    props.target
      ? `
        .marker-label {
          position: absolute;
          top: -18px;
          left: ${props.target ? props.target - 5 : 0}%;
          width: 10%;
          text-align: center;
          font-size: 0.8em;
          color: #999;
        }
      
        .marker {
          position: absolute;
          left: ${props.target}%;
          height: 34px;
          width: 3px;
          background-color: #000;
          opacity: 0.35;
          top: -2px;
          border-radius: 2px;
        }
    `
      : ""}

  ${(props) =>
    props.blockGroupColors.map(
      (blockGroupColor, index) =>
        `
      .legend li:nth-of-type(${index + 1}):before {
        background-color: ${blockGroupColor};
      }
    `
    )}

  @media screen and (min-width: 768px) {
    h6 {
      padding: 0 0.5em 0.5em 0;
      width: 6em;
      float: left;
    }
    .block {
      font-size: 1em;
    }
    .legend {
      width: 100%;
    }
  }
`;

/** Single rectangle block value representing length  */
export type Block = number;
/** Group of blocks with the same color */
export type BlockGroup = Block[];
/** One or more BlockGroups forming a single linear stacked row */
export type Row = BlockGroup[];

export type RowConfig = {
  title: string;
};

export interface HorizontalStackedBarProps {
  /** row data */
  rows: Row[];
  /** row config */
  rowConfigs: RowConfig[];
  /** Maximum value for each row */
  max: number;
  blockGroupNames: string[];
  /** Style for each block group */
  blockGroupStyles?: NonNullable<React.HTMLAttributes<HTMLElement>["style"]>[];
  target?: number;
  showTitle?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
}

/**
 * Horizontal stacked bar chart component
 */
export const HorizontalStackedBar: React.FunctionComponent<HorizontalStackedBarProps> =
  ({
    rows,
    rowConfigs,
    max = 100,
    showLegend = true,
    showTitle = true,
    target,
    blockGroupNames,
    valueFormatter,
    ...rest
  }) => {
    const numBlockGroups = rows[0].length;
    const blockGroupStyles =
      rest.blockGroupStyles && rest.blockGroupStyles.length >= numBlockGroups
        ? rest.blockGroupStyles
        : [
            { backgroundColor: "blue" },
            { backgroundColor: "green" },
            { backgroundColor: "gray" },
          ];
    const rowTotals = rows.reduce<number[]>((rowSumsSoFar, row) => {
      return [...rowSumsSoFar, sumRow(row)];
    }, []);

    const rowRems = rowTotals.map((rowTotal) => {
      const rem = max - rowTotal;
      if (rem < 0)
        throw new Error(
          `Row sum of ${rowTotal} is greater than max: ${max}. Check your input data`
        );
    });

    return (
      <StyledHorizontalStackedBar
        rowTotals={rowTotals}
        target={target}
        blockGroupColors={blockGroupStyles
          .map((style) => style.backgroundColor)
          .slice(0, numBlockGroups)}
      >
        <figure>
          <div className="graphic">
            {rows.map((row, rowNumber) => (
              <div className={`row row-${rowNumber}`}>
                {showTitle && <h6>{rowConfigs[rowNumber].title}</h6>}
                <div className="chart">
                  {row.map((blockGroup, blockGroupNumber) =>
                    blockGroup.map((blockValue, blockNumber) => (
                      <span
                        style={{
                          width: `${blockValue}%`,
                          ...blockGroupStyles[blockGroupNumber],
                        }}
                        className={`block-group-${blockGroupNumber} block-${blockNumber} block`}
                      ></span>
                    ))
                  )}
                  <div className="zero-marker" />
                  {target && (
                    <>
                      <div className="marker" />
                      <div className="marker-label">Goal</div>
                    </>
                  )}
                  <div className="total-label">
                    {valueFormatter
                      ? valueFormatter(rowTotals[rowNumber])
                      : rowTotals[rowNumber]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showLegend && (
            <div className="x-axis">
              <ul className="legend">
                {blockGroupNames.map((blockGroupName) => (
                  <li>{blockGroupName}</li>
                ))}
              </ul>
            </div>
          )}
        </figure>
      </StyledHorizontalStackedBar>
    );
  };

/** Sum row values */
const sumRow = (row: Row): number =>
  row.reduce(
    (rowSumSoFar, blockGroup) => rowSumSoFar + sumBlockGroup(blockGroup),
    0
  );

/** Sum block group values */
const sumBlockGroup = (group: BlockGroup): number =>
  group.reduce((groupSumSoFar, blockValue) => groupSumSoFar + blockValue, 0);
