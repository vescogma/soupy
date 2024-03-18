import useSWRMutation from "swr/mutation";
import { useState } from "react";
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
import { Plus } from "lucide-react";

import { post } from "@/lib/fin";

export default function NewPatientButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [firstName, setFirstName] = useState<string>();
  const [middleName, setMiddleName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [status, setStatus] = useState<string>();

  const { trigger, isMutating } = useSWRMutation(
    "/patients",
    (url, { arg }: { arg: any }) => post(url, arg)
  );

  return (
    <>
      <Button
        color="primary"
        radius="sm"
        startContent={<Plus className="w-4 h-4 stroke-[2.5]" />}
        onPress={onOpen}
      >
        Add new
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="First Name"
                  placeholder="John"
                  variant="bordered"
                  onChange={({ target }) => setFirstName(target.value)}
                />
                <Input
                  label="Middle Name"
                  placeholder="Bob"
                  variant="bordered"
                  onChange={({ target }) => setMiddleName(target.value)}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  variant="bordered"
                  onChange={({ target }) => setLastName(target.value)}
                />
                <Select
                  label="Status"
                  placeholder="Select a status"
                  variant="bordered"
                  onChange={({ target }) => setStatus(target.value)}
                >
                  {["Inquiry", "Onboarding", "Active", "Churned"].map(
                    (status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    )
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={isMutating}
                  onPress={async () => {
                    if (firstName && middleName && lastName && status) {
                      await trigger({
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        status,
                      });
                    }
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
