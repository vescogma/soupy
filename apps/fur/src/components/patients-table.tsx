import useSWR from "swr";
import { get } from "@/lib/fin";
import { Plus } from "lucide-react";
import { Button, Spinner } from "@nextui-org/react";
import NewPatientButton from "./new-patient";

export default function PatientsTable() {
  const { data, isLoading } = useSWR("/patients", get);

  return (
    <main className="max-w-[1536px] mx-auto">
      <div className="flex justify-between px-6 py-4">
        <h1 className="text-2xl">Patients</h1>
        <NewPatientButton />
      </div>
      <section className="px-6 py-4">
        {isLoading && <Spinner />}
        {!isLoading && data && (
          <div className="grid grid-cols-3">
            <div className="text-sm font-semibold">NAME</div>
            <div className="text-sm font-semibold">DOB</div>
            <div className="text-sm font-semibold">STATUS</div>
          </div>
        )}
      </section>
    </main>
  );
}
