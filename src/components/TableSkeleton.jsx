export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full animate-pulse h-full">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 px-2 border-b border-gray-100">
          {[...Array(columns)].map((_, j) => (
            <div 
              key={j} 
              className={`h-4 bg-gray-200 rounded-lg ${j === 0 ? 'w-10' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};