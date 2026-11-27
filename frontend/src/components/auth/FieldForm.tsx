interface FieldFormProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FieldForm({
  label,
  placeholder,
  type,
  value,
  onChange,
}: FieldFormProps) {
  return (
    <label className="relative border border-gray-200 focus-within:border-main rounded-xl w-full transition-all">
      <span className="absolute -top-3 left-2 bg-white px-1 text-zinc-500  text-sm">
        {label}
      </span>
      <input
        className="text-md p-3 focus:outline-none w-full"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}