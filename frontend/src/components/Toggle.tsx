import React,  { useState } from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({
  label,
  checked,
  onChange,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  function handleClick() {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  }

  return (
    <div className="flex items-center justify-start space-x-4">
      <span className="text-gray-300">{label}</span>
      <button
        className={`${
          isChecked ? "bg-green-600" : "bg-gray-300"
        } relative inline-flex items-center h-6 rounded-full w-11`}
        onClick={handleClick}
      >
        <span
          className={`${
            isChecked ? "translate-x-6" : "translate-x-1"
          } inline-block w-4 h-4 transform transition-all bg-white rounded-full`}
        />
      </button>
    </div>
  );
}
