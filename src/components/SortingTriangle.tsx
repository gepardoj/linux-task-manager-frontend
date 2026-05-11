const descendingStyle = `
    border-l-10 border-l-transparent
    border-r-10 border-r-transparent
    border-t-15 border-t-purple-700
`;

const ascendingStyle = `
    border-l-10 border-l-transparent
    border-r-10 border-r-transparent
    border-b-15 border-b-purple-700
`;

export function SortingTriangle({
  className,
  order,
}: {
  className: string;
  order: "asc" | "desc" | null;
}) {
  return (
    <>
      <button
        class={`w-4 h-4 inline-block 
            cursor-pointer
            ${order === "asc" ? ascendingStyle : descendingStyle}
            ${order === null && "border-b-transparent border-t-transparent"}
            ${className}
      `}
      />
    </>
  );
}
