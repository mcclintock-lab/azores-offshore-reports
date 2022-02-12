import React, { ReactNode } from "react";
import {
  CircleProps,
  StyledCircle
} from "@seasketch/geoprocessing/client-ui";
import styled from 'styled-components'

const StyledClassCircle = styled(StyledCircle)`
  border: 3px solid white;
  border-top-left-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  border-top-right-radius: 0;
  border-bottom-left-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  border-bottom-right-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  box-shadow: 1px 1px 3px 2px rgba(0,0,0,0.15);
  color: white;
  font-weight: bold;
`

/** Circle with pointy top right corner */
export const PointyCircle: React.FunctionComponent<CircleProps> = ({
  children,
  color,
  size,
}) => {
  return (
    <StyledClassCircle color={color} size={size}>
      {children}
    </StyledClassCircle>
  );
};

export interface StyledTwoColorPointyCircleProps {
  bottomColor?: string;
  topColor?: string;
  perc?: number;
  size?: number;
}

export interface TwoColorPointyCircleProps {
  children: ReactNode;
  /** Bottom color of circle */
  bottomColor?: string;
  /** Top color of circle */
  topColor?: string;
  /** Percent height bottom color will take up */
  perc?: number;
  /** Radius of circle in pixels, minimum 5 */
  size?: number;
}

export const StyledTwoColorPointyCircle = styled.span<StyledTwoColorPointyCircleProps>`
  background-color: green;
  background-image:
    linear-gradient(
      ${(props) => (props.bottomColor || 'blue')} ${(props) => (`${100 - (props.perc || 50)}%`)},
      ${(props) => (props.topColor || 'red')} ${(props) => (`${100 - (props.perc || 50)}%`)}
    );
  padding: 3px 5px;
  border-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  min-width: ${(props) => (props.size ? `${props.size}px` : "17px")};
  max-width: ${(props) => (props.size ? `${props.size}px` : "17px")};
  height: ${(props) => (props.size ? `${props.size + 4}px` : "21px")};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
  border-top-left-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  border-top-right-radius: 0;
  border-bottom-left-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  border-bottom-right-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  box-shadow: 1px 1px 3px 2px rgba(0,0,0,0.15);
  color: white;
  font-weight: bold;
`

/** Two-color reg-based classification circle for collection index value */
export const TwoColorPointyCircle: React.FunctionComponent<TwoColorPointyCircleProps> = ({
  children,
  topColor,
  bottomColor,
  perc,
  size,
}) => {
  return (
    <StyledTwoColorPointyCircle topColor={topColor} bottomColor={bottomColor} perc={perc} size={size}>
      {children}
    </StyledTwoColorPointyCircle>
  );
};