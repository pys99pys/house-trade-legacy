import { FC, useState } from "react";
import styles from "./Select.module.css";

interface SelectProps {
  width?: string;
  options: { label: string; value: string }[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const Select: FC<SelectProps> = ({
  width,
  options,
  placeholder,
  value,
  onChange,
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 50);
  };

  return (
    <div style={{ width }} className={styles.select}>
      <span className="label">
        {options.find((option) => option.value === value)?.label ?? placeholder}
      </span>
      <span className={styles.arrow}>▾</span>
      {!clicked && (
        <div className={styles.list} onClick={handleClick}>
          <ul>
            {options.map((option) => (
              <li key={option.value} onClick={() => onChange(option.value)}>
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
