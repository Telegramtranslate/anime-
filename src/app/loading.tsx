export default function Loading() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 pt-32 md:px-10 md:pt-40">
      <div className="skeleton h-12 w-72 rounded-2xl" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[2/3] rounded-2xl" />
            <div className="skeleton mt-3 h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
