function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

      <p className="mt-4 text-gray-600 font-medium">
        {text}
      </p>
    </div>
  );
}

export default Loading;