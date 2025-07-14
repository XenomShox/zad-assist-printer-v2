// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMachineContext } from "@/context/machine";

import { Combobox } from "../combobox";
import { ModeToggle } from "../mode-toggle";
import UserAvatar from "./user-avatar";

const DashboarHeader = () => {
  const { machines, machine, setMachine } = useMachineContext();

  const handleChangeMachine = (value: string) => setMachine(value);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {machines.data && (
          <Combobox
            options={machines.data
              .map((m) => ({ value: m.id, label: m.name }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            value={machine}
            onChange={handleChangeMachine}
          />
        )}
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
      <div className="flex gap-2">
        <ModeToggle />
        <UserAvatar />
      </div>
    </header>
  );
};

export default DashboarHeader;
