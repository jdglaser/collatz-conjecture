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
    if (event.target.validity.patternMismatch) {
        return;
    }

    if (value === "") {
      setLocalVal(null);
      setValue(null);
      return;
    }
    
    if (value[0] === "-") {
      if (allowNegative && value.length === 1) {
        setLocalVal(value);
        return;
      }

      if (allowNegative && value.length > 1) {
        setLocalVal(value);
        setValue(parseInt(value, 10))
      }
    } else {
      if (value.includes("-")) {
        return;
      }
      const newValue = parseInt(value, 10);
      if (isNaN(newValue)) {
        return;
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