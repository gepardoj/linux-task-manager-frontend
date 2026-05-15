import { ProcessesTable } from "../../features/processes/components/ProcessesTable";

export function Home() {
  return (
    <div class="pt-4 w-full flex flex-col h-[90vh] gap-4">
      <ProcessesTable />
    </div>
  );
}
