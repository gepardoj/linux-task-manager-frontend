import { useEffect, useMemo, useState } from "preact/hooks";
import preactLogo from "../../assets/preact.svg";
import "./style.css";
import { ProcessInfo } from "../../models/Process";

export function Home() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const filteredProcesses = useMemo<ProcessInfo[]>(
    () =>
      processes.filter((proc) =>
        proc.name.toLowerCase().includes(filter.toLowerCase()),
      ),
    [processes, filter],
  );

  const fetchProcesses = async () => {
    try {
      const response = await fetch("http://localhost:3000/processes");
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
  }, []);

  if (loading) return <div>Loading processes...</div>;

  return (
    <div class="pt-4 w-full flex flex-col gap-4">
      <input
        class="outline-1"
        type="text"
        value={filter}
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
      <table>
        <thead>
          <tr>
            <th>PID</th>
            <th>Name</th>
            <th>Memory</th>
          </tr>
        </thead>
        <tbody>
          {filteredProcesses.map((proc) => (
            <tr key={proc.pid}>
              <td>{proc.pid}</td>
              <td>{proc.name}</td>
              <td>{proc.memory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
