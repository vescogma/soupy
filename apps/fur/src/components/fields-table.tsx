import useSWR from "swr";
import { Fragment } from "react";
import { Chip, Spinner } from "@nextui-org/react";
import { Hash, Text } from "lucide-react";
import { ConfigField } from "@repo/database/client";

import { get } from "@/lib/fin";
import { SettingsNewModal } from "./fields-new-modal";

export function FieldsTable() {
  const { data, isLoading, mutate } = useSWR<ConfigField[]>(
    `/config-fields`,
    get
  );

  return (
    <div className="flex flex-col gap-3 py-6">
      <h1 className="text-2xl px-6">Fields</h1>
      <div className="flex justify-end px-6">
        <SettingsNewModal onCreate={() => mutate()} />
      </div>
      <section className="px-6">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 border-b py-2">
            <p className="text-sm font-bold uppercase">LABEL</p>
          </div>
          <div className="flex items-center gap-2 border-b py-2">
            <p className="text-sm font-bold uppercase">TYPE</p>
          </div>
          <div className="flex items-center gap-2 border-b py-2">
            <p className="text-sm font-bold uppercase">CREATED</p>
          </div>
          {isLoading && (
            <div className="col-span-full">
              <Spinner />
            </div>
          )}
          {(data ?? []).map((configField) => (
            <Fragment key={configField.id}>
              <div className="">{configField.label}</div>
              <div className="">
                <Chip
                  radius="sm"
                  startContent={
                    configField.type === "Number" ? (
                      <Hash className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Text className="h-4 w-4 stroke-[2.5]" />
                    )
                  }
                  classNames={{
                    base:
                      configField.type === "Number"
                        ? "bg-teal-300 dark:bg-teal-800"
                        : "bg-sky-300 dark:bg-sky-800",
                  }}
                >
                  {configField.type}
                </Chip>
              </div>
              <div className="">
                {(configField.created_at as unknown as string).split("T")[0]}
              </div>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
