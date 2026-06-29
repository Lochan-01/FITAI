export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 text-white py-3 rounded-xl font-semibold ${className}`}
    >
      {children}
    </button>
  );
}