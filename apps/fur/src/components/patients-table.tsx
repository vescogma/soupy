import useSWR from "swr";
import { Fragment, ReactNode, useCallback, useEffect, useState } from "react";
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowDownZA,
  Search,
  Settings,
} from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { Patient } from "@repo/database/client";
import {
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";

import { get } from "@/lib/fin";
import { PatientsNewModal } from "./patients-new-modal";

const STATUSES = ["Active", "Churned", "Inquiry", "Onboarding"] as const;

export function PatientsTable() {
  const [searchParams, setSearchParams] = useState<string>("");
  const [[sortK, sortV], setSort] = useState<[string, string]>([
    "created_at",
    "desc",
  ]);
  const [nameQ, setNameQ] = useState<string>("");
  const [dobQ, setDobQ] = useState<string>("");
  const [statusQ, setStatusQ] = useState<Selection>(new Set([]));
  const [debouncedNameQ, setDebouncedNameQ] = useDebounceValue<string>("", 500);
  const [debouncedDobQ, setDebouncedDobQ] = useDebounceValue<string>("", 500);

  const { data, isLoading, mutate } = useSWR<Patient[]>(
    `/patients${searchParams ? "?" + searchParams : ""}`,
    get
  );

  useEffect(() => {
    setDebouncedNameQ(nameQ);
  }, [nameQ]);

  useEffect(() => {
    setDebouncedDobQ(dobQ);
  }, [dobQ]);

  useEffect(() => {
    const search = new URLSearchParams();
    if (debouncedNameQ.length > 0) {
      search.append("filters[first_name]", `${debouncedNameQ}:*`);
      search.append("filters[middle_name]", `${debouncedNameQ}:*`);
      search.append("filters[last_name]", `${debouncedNameQ}:*`);
    }
    if (debouncedDobQ.length > 0) {
      search.append("filters[dob]", `${debouncedDobQ}:*`);
    }
    Array.from(statusQ).forEach((key) => {
      search.append("filters[status]", key as string);
    });
    setSearchParams(search.toString());
  }, [debouncedNameQ, debouncedDobQ, statusQ, sortK, sortV]);

  async function handleSort(key: string, order: string) {
    if (!key || !order) {
      setSort(["created_at", "desc"]);
    } else {
      setSort([key, order]);
    }
  }

  return (
    <div className="flex flex-col gap-3 py-6">
      <h1 className="text-2xl px-6">Patients</h1>
      <div className="flex justify-end px-6">
        <PatientsNewModal onCreate={() => mutate()} />
      </div>
      <section className="px-6">
        <div className="grid grid-cols-3 gap-2">
          <Header
            label="Name"
            isActive={nameQ.length > 0 || sortK === "first_name"}
            options={
              <div className="mt-2 flex flex-col gap-2 w-full">
                <SearchField value={nameQ} onChange={setNameQ} />
                <SortField
                  value={sortK === "first_name" ? sortV : ""}
                  onChange={(val) => handleSort("first_name", val)}
                />
              </div>
            }
          />
          <Header
            label="DOB"
            isActive={dobQ.length > 0 || sortK === "dob"}
            options={
              <div className="mt-2 flex flex-col gap-2 w-full">
                <SearchField value={dobQ} onChange={setDobQ} />
                <SortField
                  value={sortK === "dob" ? sortV : ""}
                  onChange={(val) => handleSort("dob", val)}
                />
              </div>
            }
          />
          <Header
            label="Status"
            isActive={Array.from(statusQ).length > 0 || sortK === "status"}
            options={
              <div className="mt-2 flex flex-col gap-2 w-full">
                <Select
                  selectionMode="multiple"
                  label="Status"
                  variant="bordered"
                  radius="sm"
                  selectedKeys={statusQ}
                  onSelectionChange={setStatusQ}
                >
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            }
          />
          {isLoading && (
            <div className="col-span-full">
              <Spinner />
            </div>
          )}
          {(data ?? []).map((patient) => (
            <Fragment key={patient.id}>
              <div className="">
                {patient.first_name}
                {patient.middle_name ? " " + patient.middle_name : ""}{" "}
                {patient.last_name}
              </div>
              <div className="">{patient.dob}</div>
              <div className="">{patient.status}</div>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}

function Header({
  label,
  isActive,
  options,
}: {
  label: string;
  isActive: boolean;
  options: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b py-2">
      <p className="text-sm font-bold uppercase">{label}</p>
      <Popover placement="right" showArrow offset={10}>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="flat"
            color={isActive ? "primary" : "default"}
            isIconOnly
          >
            <Settings className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px]">
          {(titleProps) => (
            <div className="px-1 py-2 w-full">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                {label} options
              </p>
              {options}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (query: string) => void;
}) {
  return (
    <Input
      label="Search"
      variant="bordered"
      placeholder="Type to search..."
      radius="sm"
      startContent={
        <Search className="w-5 h-5 stroke-[2.5] text-foreground-400" />
      }
      value={value}
      onChange={({ target }) => onChange(target.value)}
      onClear={() => onChange("")}
      autoFocus
      isClearable
    />
  );
}

function SortField({
  value,
  onChange,
}: {
  value: string;
  onChange: (query: string) => void;
}) {
  const OPTIONS = [
    {
      key: "asc",
      label: "ASC",
      icon: <ArrowDownAZ className="h-4 w-4 stroke-[2.5]" />,
    },
    {
      key: "desc",
      label: "DESC",
      icon: <ArrowDownZA className="h-4 w-4 stroke-[2.5]" />,
    },
  ];
  return (
    <Select
      label="Sort"
      variant="bordered"
      radius="sm"
      selectedKeys={[value]}
      startContent={
        <ArrowDownUp className="w-5 h-5 stroke-[2.5] text-foreground-400" />
      }
      onChange={({ target }) => onChange(target.value)}
    >
      {OPTIONS.map(({ key, label, icon }) => (
        <SelectItem key={key} value={key} textValue={label} startContent={icon}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
}
