import { useState, type ChangeEvent } from 'react'

type Props = {
  id: string
  name?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  autoComplete?: string
  placeholder?: string
  'aria-describedby'?: string
}

function IconEye() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1={2} x2={22} y1={2} y2={22} />
    </svg>
  )
}

export default function PasswordInputWithToggle({
  id,
  name,
  value,
  onChange,
  disabled = false,
  autoComplete,
  placeholder,
  'aria-describedby': ariaDescribedBy,
}: Props) {
  const [visible, setVisible] = useState(false)
  const hasContent = value.trim().length > 0
  const toggleDisabled = disabled || !hasContent

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.trim() === '') setVisible(false)
    onChange(e)
  }

  return (
    <div className="auth-input-password-wrap">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
      />
      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        disabled={toggleDisabled}
        title={
          !hasContent && !disabled
            ? 'Escribe una contraseña para poder mostrarla u ocultarla'
            : undefined
        }
      >
        {visible ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  )
}
