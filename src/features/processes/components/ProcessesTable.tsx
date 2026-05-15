import { SERVER_URL } from "@/constants/constants";
import { useEffect, useMemo, useState } from "preact/hooks";
import { ProcessInfo } from "../Process";
import { CogIcon } from "@/icons/CogIcon";
import { ProcessMenu } from "./ProcessMenu";
import { HeadersConfigPopup } from "./HeadersConfigPopup";
import { SortingTriangle } from "@/components/SortingTriangle";

export type Header = {
  id: keyof ProcessInfo;
  name: string;
  visible: boolean;
  order: "asc" | "desc" | null;
};

const defaultHeaders: Header[] = [
  { id: "pid", name: "PID", order: "asc", visible: true },
  { id: "name", name: "Name", order: null, visible: true },
  { id: "cmdline", name: "Command Line", order: null, visible: true },
  { id: "memory", name: "Memory", order: null, visible: true },
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

export function ProcessesTable() {
  const [processes, setProcesses] = useState<ProcessInfo[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [headers, setHeaders] = useState<Header[]>(defaultHeaders);
  const [headersPopupOpen, setHeadersPopupOpen] = useState(false);
  const [selectedPID, setSelectedPID] = useState<number | null>(null);

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

  const headersObj = useMemo<Record<keyof ProcessInfo, Header>>(
    () =>
      headers.reduce(
        (acc, h) => ({ ...acc, [h.id]: h }),
        {} as Record<keyof ProcessInfo, Header>,
      ),
    [headers],
  );

  // filtered by pid, name or cmdline
  const filteredProcesses = useMemo<ProcessInfo[]>(
    () =>
      Array.isArray(processes)
        ? processes.filter(
            (proc) =>
              proc.pid.toString().includes(filter.toLowerCase()) ||
              proc.name.toLowerCase().includes(filter.toLowerCase()) ||
              proc.cmdline.toLowerCase().includes(filter.toLowerCase()),
          )
        : [],
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
        `${SERVER_URL}/processes?${sortParams.toString()}`,
      );
      const data = await response.json();
      setProcesses(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch processes: ${err}`);
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = fetchProcesses();
  }, [sortedHeader]);

  return (
    <>
      <div class="flex gap-2 px-4">
        <input
          class="outline-1 grow"
          type="text"
          value={filter}
          onInput={(e) => setFilter(e.currentTarget.value)}
        />
        <CogIcon
          class="cursor-pointer"
          onClick={() => setHeadersPopupOpen(!headersPopupOpen)}
        />
      </div>
      {error && <div class="text-red-500">{error}</div>}
      {loading && <div>Loading...</div>}
      <ProcessMenu
        isOpen={selectedPID !== null}
        pid={selectedPID ?? 0}
        onClose={() => setSelectedPID(null)}
      />
      <HeadersConfigPopup
        isOpen={headersPopupOpen}
        onClose={() => setHeadersPopupOpen(false)}
        elementsState={[headers, setHeaders]}
      />
      <div class="overflow-auto grow">
        <table class="w-full">
          <thead class="relative">
            <tr>
              {headers
                .filter((h) => h.visible)
                .map((h) => (
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
              <tr
                key={proc.pid}
                class="cursor-pointer hover:bg-purple-100"
                onClick={() => setSelectedPID(proc.pid)}
              >
                {headersObj["pid"].visible && <td>{proc.pid}</td>}
                {headersObj["name"].visible && (
                  <td>
                    <div class="flex">
                      {proc.iconPath !== "" ? (
                        <img
                          class="w-6 h-6 mr-2 select-none"
                          src={`${SERVER_URL}/assets/${proc.iconPath}`}
                          alt={proc.name}
                        />
                      ) : null}
                      {proc.name}
                    </div>
                  </td>
                )}
                {headersObj["cmdline"].visible && (
                  <td class="wrap-anywhere">{proc.cmdline}</td>
                )}
                {headersObj["memory"].visible && (
                  <td>
                    {new Intl.NumberFormat("fr-FR").format(proc.memory) + " kB"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div class="bg-purple-200 p-4 border-t border-purple-300">
        total: {filteredProcesses.length} total memory:{" "}
        {new Intl.NumberFormat("fr-FR").format(totalMemory) + " kB"}
      </div>
    </>
  );
}
