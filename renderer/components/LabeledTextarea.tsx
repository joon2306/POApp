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


interface TextAreaProps {
  text: string;
  setText: (text: string) => void;
  row: number;
  required: boolean;
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


const TextAreaComponent = ({text, setText, row, required}: TextAreaProps) => {
  return (
    <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        rows={row}
        required={required}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your French email text here..."
      />
  )
}

export default LabeledTextarea;

export { TextAreaComponent };