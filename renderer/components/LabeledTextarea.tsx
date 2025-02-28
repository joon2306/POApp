import { ChangeEvent } from 'react';

interface LabeledTextareaProps {
  id: string;
  name: string;
  label: string;
  rows: number;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const LabeledTextarea: React.FC<LabeledTextareaProps> = ({
  id,
  name,
  label,
  rows,
  value,
  placeholder,
  required = false,
  onChange
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      ></textarea>
    </div>
  );
};

export default LabeledTextarea;