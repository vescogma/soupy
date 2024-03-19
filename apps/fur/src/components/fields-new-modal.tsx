import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Patient, Prisma } from "@repo/database/client";
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

import { post } from "@/lib/fin";

const formSchema = z.object({
  type: z.string().min(1),
  label: z.string().min(1),
});

export function SettingsNewModal({
  onCreate,
}: {
  onCreate: (patient: Patient) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { trigger, isMutating } = useSWRMutation(
    "/config-fields",
    (url, { arg }: { arg: Prisma.ConfigFieldCreateInput }) => post(url, arg)
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const configField = await trigger({
      type: values.type,
      label: values.label,
    });
    onCreate(configField);
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
                New patient form field
              </ModalHeader>
              <ModalBody>
                <form
                  id="new-config-field-form"
                  className="flex flex-col gap-3"
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  <Controller
                    name="label"
                    control={methods.control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        label="Label"
                        variant="bordered"
                        radius="sm"
                        isRequired
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="type"
                    control={methods.control}
                    render={({ field }) => (
                      <Select
                        label="Field type"
                        variant="bordered"
                        radius="sm"
                        isRequired
                        {...field}
                      >
                        {["Text", "Number"].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
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
                  form="new-config-field-form"
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
