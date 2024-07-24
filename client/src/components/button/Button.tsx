import cx from "classnames";
import { FC, ReactNode } from "react";

import styles from "./Button.module.css";

interface ButtonProps {
  size?: "default" | "large" | "small" | "xsmall";
  color?: "default" | "primary" | "red" | "yellow";
  children: ReactNode;
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
  size = "default",
  color = "default",
  children,
  onClick,
}) => {
  return (
    <button
      className={cx(styles.button, {
        [styles.defaultSize]: size === "default",
        [styles.largeSize]: size === "large",
        [styles.smallSize]: size === "small",
        [styles.xsmallSize]: size === "xsmall",
        [styles.defaultColor]: color === "default",
        [styles.primaryColor]: color === "primary",
        [styles.redColor]: color === "red",
        [styles.yellowColor]: color === "yellow",
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
