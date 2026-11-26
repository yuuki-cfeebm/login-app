interface SubmitButtonProps {
  label: string
}

export default function SubmitButton({ label }: SubmitButtonProps) {
  return(
    <button className="w-full p-3 bg-[#2b7fff] hover:bg-[#134da5] rounded-xl text-white font-bold cursor-pointer transition-all">
      {label}
    </button>
  )
}