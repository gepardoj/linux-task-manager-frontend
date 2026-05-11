import { useEffect, useMemo, useState } from "preact/hooks";
import "./style.css";
import { ProcessInfo } from "../../models/Process";
import { SortingTriangle } from "../../components/SortingTriangle";

type Header = {
  id: string;
  name: string;
  order: "asc" | "desc" | null;
};

const defaultHeaders: Header[] = [
  { id: "pid", name: "PID", order: "asc" },
  { id: "name", name: "Name", order: null },
  { id: "memory", name: "Memory", order: null },
];

function changeSortOrder(order: "asc" | "desc" | null): "asc" | "desc" | null {
  switch (order) {
    case "asc":
      return "desc";
    case "desc":
      return null;
    case null:
      return "asc";
  }
}

export function Home() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [headers, setHeaders] = useState<Header[]>(defaultHeaders);

  function onChangeSorting(id: string) {
    console.log(id, headers);
    setHeaders((oldHeaders) =>
      oldHeaders.map((h) =>
        h.id === id
          ? { ...h, order: changeSortOrder(h.order) }
          : { ...h, order: null },
      ),
    );
  }

  const sortedHeader = useMemo(
    () => headers.find((h) => h.order !== null),
    [headers],
  );

  const filteredProcesses = useMemo<ProcessInfo[]>(
    () =>
      processes.filter((proc) =>
        proc.name.toLowerCase().includes(filter.toLowerCase()),
      ),
    [processes, filter],
  );

  const totalMemory = useMemo<number>(
    () => filteredProcesses.map((p) => p.memory).reduce((a, b) => a + b, 0),
    [filteredProcesses],
  );

  const fetchProcesses = async () => {
    try {
      const sortParams = new URLSearchParams({
        sortBy: sortedHeader?.id ?? "pid",
        order: sortedHeader?.order ?? "asc",
      });
      const response = await fetch(
        `http://localhost:3000/processes?${sortParams.toString()}`,
      );
      const data = await response.json();
      setProcesses(data);
    } catch (err) {
      console.log("Failed to fetch processes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
    const inverval = setInterval(fetchProcesses, 1000);
    return () => clearInterval(inverval);
  }, [sortedHeader]);

  if (loading) return <div>Loading processes...</div>;

  return (
    <div class="pt-4 w-full flex flex-col h-[90vh] gap-4">
      <input
        class="outline-1 px-2"
        type="text"
        value={filter}
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
      <main class="grow overflow-auto">
        <table class="w-full">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h.id}
                  class="cursor-pointer"
                  onClick={() => onChangeSorting(h.id)}
                >
                  <div class="flex">
                    <SortingTriangle className="mr-2" order={h.order} />
                    {h.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map((proc) => (
              <tr key={proc.pid}>
                <td>{proc.pid}</td>
                <td>{proc.name}</td>
                <td>
                  {new Intl.NumberFormat("fr-FR").format(proc.memory) + " kB"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <div class="bg-purple-200 p-4 border-t border-purple-300">
        total: {filteredProcesses.length} total memory:{" "}
        {new Intl.NumberFormat("fr-FR").format(totalMemory) + " kB"}
      </div>
    </div>
  );
}
