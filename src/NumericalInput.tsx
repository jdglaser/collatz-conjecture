import React, {useState} from "react";

interface NumericInputProps {
  setValue: React.Dispatch<React.SetStateAction<number | null>>
  allowNegative?: boolean
}

export default function NumericInput(props: NumericInputProps) {
  const {setValue, allowNegative} = props;

  const [localVal, setLocalVal] = useState<string | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === "") {
      setValue(null);
      setLocalVal(null);
    } else if (value === "-" && allowNegative) {
      setValue(null);
      setLocalVal(value)
    } else {
      const newValue = parseInt(value, 10);
      if (isNaN(newValue)) {
        setValue(null);
        setLocalVal(null);
      } else {
        setValue(newValue);
        setLocalVal(value)
      }
    }
  }

  return (
    <input
      type="text"
      pattern="[-0-9]*"
      value={localVal !== null ? localVal : ""}
      onChange={onChange} />
  );
}