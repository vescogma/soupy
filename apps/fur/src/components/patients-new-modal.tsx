import useSWRMutation from "swr/mutation";
import { z } from "zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import {
  ConfigField,
  Patient,
  PatientStatus,
  Prisma,
} from "@repo/database/client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { get, post } from "@/lib/fin";
import useSWR from "swr";
import { useMemo } from "react";

const STATUSES = [
  PatientStatus.Active,
  PatientStatus.Churned,
  PatientStatus.Inquiry,
  PatientStatus.Onboarding,
] as const;

export function PatientsNewModal({
  onCreate,
}: {
  onCreate: (patient: Patient) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: configFields, isLoading } = useSWR<ConfigField[]>(
    "/config-fields",
    get
  );

  const formSchema = useMemo(
    () =>
      z.object({
        first_name: z.string().min(1),
        middle_name: z.string().optional(),
        last_name: z.string().min(1),
        dob: z.string().min(1),
        status: z.enum(STATUSES),
        addresses: z
          .array(
            z.object({
              line_1: z.string().min(1),
              line_2: z.string().optional(),
              city: z.string().min(1),
              state: z.string().min(1),
            })
          )
          .optional(),
        config: z.record(z.string(), z.string().optional()).optional(),
      }),
    [configFields]
  );

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  console.log(methods.watch("config"));

  const { trigger, isMutating } = useSWRMutation(
    "/patients",
    (url, { arg }: { arg: Prisma.PatientCreateInput }) => post(url, arg)
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const patient = await trigger({
      first_name: values.first_name,
      middle_name: values.middle_name,
      last_name: values.last_name,
      dob: values.dob,
      status: values.status,
      config: values.config,
      patient_addresses:
        (values.addresses ?? []).length > 0
          ? { create: values.addresses }
          : undefined,
    });
    onCreate(patient);
    methods.reset();
    onClose();
  }

  return (
    <FormProvider {...methods}>
      <Button
        color="primary"
        radius="sm"
        startContent={<Plus className="w-4 h-4 stroke-[2.5]" />}
        onPress={onOpen}
      >
        Add new
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        scrollBehavior="inside"
        radius="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New patient
              </ModalHeader>
              <ModalBody>
                <form
                  id="new-patient-form"
                  className="flex flex-col gap-3"
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  <h3 className="font-medium">Details</h3>
                  <DetailsFields />
                  <h3 className="font-medium">Extra</h3>
                  <Controller
                    name="status"
                    control={methods.control}
                    render={({ field }) => (
                      <Select
                        label="Status"
                        variant="bordered"
                        radius="sm"
                        isRequired
                        {...field}
                      >
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  {(configFields ?? []).map((cf) => (
                    <Controller
                      key={cf.id}
                      name={`config.${cf.id}`}
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          type={cf.type === "Number" ? "number" : "text"}
                          label={cf.label}
                          variant="bordered"
                          radius="sm"
                          {...field}
                        />
                      )}
                    />
                  ))}
                  <h3 className="font-medium">Address</h3>
                  <AddressFields />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  variant="bordered"
                  radius="sm"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  radius="sm"
                  type="submit"
                  form="new-patient-form"
                  disabled={isMutating}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}

function DetailsFields() {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            label="First name"
            variant="bordered"
            radius="sm"
            autoFocus
            isRequired
            {...field}
          />
        )}
      />
      <Controller
        name="middle_name"
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            label="Middle name"
            variant="bordered"
            radius="sm"
            {...field}
          />
        )}
      />
      <Controller
        name="last_name"
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            label="Last name"
            variant="bordered"
            radius="sm"
            isRequired
            {...field}
          />
        )}
      />
      <Controller
        name="dob"
        control={control}
        render={({ field }) => (
          <Input
            type="date"
            label="Date of birth"
            variant="bordered"
            radius="sm"
            isRequired
            {...field}
          />
        )}
      />
    </>
  );
}

function AddressFields() {
  const { control } = useFormContext();
  const addresses = useFieldArray({ name: "addresses", control });
  return (
    <div className="divide-y">
      {addresses.fields.map((item, idx) => (
        <div key={item.id} className="flex gap-1 py-4 first:pt-0">
          <div className="flex-1 flex flex-col gap-1">
            <Controller
              name={`addresses.${idx}.line_1`}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Line 1"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  isRequired
                  {...field}
                />
              )}
            />
            <Controller
              name={`addresses.${idx}.line_2`}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Line 2"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  {...field}
                />
              )}
            />
            <Controller
              name={`addresses.${idx}.city`}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="City"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  isRequired
                  {...field}
                />
              )}
            />
            <Controller
              name={`addresses.${idx}.state`}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="State"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  isRequired
                  {...field}
                />
              )}
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => addresses.remove(idx)}
            isIconOnly
          >
            <Trash className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </div>
      ))}
      {(addresses.fields ?? []).length > 0 ? (
        <Button
          size="sm"
          radius="sm"
          startContent={<Plus className="w-3 h-3 stroke-[2.5]" />}
          onPress={() => addresses.append({ line_1: "", city: "", state: "" })}
        >
          Add another
        </Button>
      ) : (
        <Button
          radius="sm"
          startContent={<Plus className="w-4 h-4 stroke-[2.5]" />}
          className="w-full"
          onPress={() => addresses.append({ line_1: "", city: "", state: "" })}
        >
          Add address
        </Button>
      )}
    </div>
  );
}
