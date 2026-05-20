import { useMemo, useState } from "preact/hooks";
import { ProcessInfo } from "../Process";
import { CogIcon } from "@/icons/CogIcon";
import { ProcessMenu } from "./ProcessMenu";
import { HeadersConfigPopup } from "./HeadersConfigPopup";
import { changeSortOrder, SortingTriangle } from "@/components/SortingTriangle";
import { apiClient, SERVER_URL } from "@/services/global.api";
import { useQuery } from "@tanstack/react-query";
import { Header, useProcessesTableStore } from "../processes.store";

export function ProcessesTable() {
  const [filter, setFilter] = useState("");
  const { visibleColumns: headers, setVisibleColumns: setHeaders } =
    useProcessesTableStore();
  const [headersPopupOpen, setHeadersPopupOpen] = useState(false);
  const [selectedPID, setSelectedPID] = useState<number | null>(null);
  const {
    data: processes,
    isLoading,
    error,
    refetch,
  } = useQuery<ProcessInfo[]>({
    queryKey: ["processes", headers],

    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const sortParams = new URLSearchParams({
        sortBy: sortedHeader?.id ?? "pid",
        order: sortedHeader?.order ?? "asc",
      });
      const res = await apiClient.get(`/processes?${sortParams.toString()}`);
      return res.data;
    },
  });

  function onChangeSorting(id: string) {
    setHeaders(
      headers.map((h) =>
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

  return (
    <>
      <div class="flex gap-2 px-4">
        <input
          class="outline-1 grow px-2"
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
      {isLoading && <div>Loading...</div>}
      <ProcessMenu
        isOpen={selectedPID !== null}
        pid={selectedPID ?? 0}
        onClose={() => {
          setSelectedPID(null);
          refetch();
        }}
      />
      <HeadersConfigPopup
        isOpen={headersPopupOpen}
        onClose={() => setHeadersPopupOpen(false)}
        elementsState={[headers, setHeaders]}
      />
      {/*****  TABLE *****/}
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
