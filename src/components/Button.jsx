function Button({
  text,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold transition duration-300 hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;