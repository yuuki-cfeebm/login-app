import Image from "next/image"

interface HeaderFormProps {
  title: string
  description: string
}

export default function HeaderForm({ title, description }: HeaderFormProps){
  return(
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 mb-5 stroke-blue-500 text-blue-500">
        <Image
          src="/images/logo-form.svg"
          alt="Logo do formulário"
          fill
          className="object-contain"
          color="#2b7fff"
        />
      </div>
      <h2 className="text-3xl font-semibold">{title}</h2>
      <span className="text-lg">{description}</span>
    </div>
  )
}