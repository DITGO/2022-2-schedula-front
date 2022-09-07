import { useCallback } from "react"
import { toast } from "react-toastify"
import { Button, HStack } from "@chakra-ui/react"
import { AxiosResponse } from "axios"

import { UserItem } from "@components/Items/UserItem"
import { ListView } from "@components/List"
import { UserModal } from "@components/Modals/UserModal"
import { PageHeader } from "@components/PageHeader"
import { RefreshButton } from "@components/RefreshButton"
import { useRequest } from "@hooks/useRequest"
import { getUsers } from "@services/Usuarios"

const RoleBadge = (role: Accesses) => {
  switch (role) {
    case "admin":
      return (
        <Badge colorScheme="purple" variant="solid">
          Admin
        </Badge>
      )

    case "basic":
      return <Badge>Basico</Badge>

    case "manager":
      return <Badge colorScheme="green">Gerente</Badge>

    default:
      return <Badge>Basico</Badge>
  }
}

const Usuarios = () => {
  const {
    data: users,
    isLoading,
    isValidating,
    mutate
  } = useRequest<User[]>(getUsers)

  const refresh = useCallback(
    (data?: User[]) =>
      mutate(
        {
          data: {
            error: null,
            message: "",
            data: data ?? []
          }
        } as AxiosResponse<ApiResponse<User[]>>,
        { revalidate: !data }
      ),
    [mutate]
  )

  const onDelete = useCallback(
    (result: Result<ApiResponse<null>>, { username }: User) => {
      if (result.type === "success") {
        toast.success(result.value?.message)

        const newUsers = users?.data.filter(
          (user) => user.username !== username
        )
        refresh(newUsers)

        return
      }

      toast.error(result.error?.message)
    },
    [refresh, users?.data]
  )

  const onEdit = useCallback(
    (user: User) => {
      setUserToEdit(user)
      onOpen()
    },
    [onOpen]
  )

  const onSubmit = useCallback(
    (result: Result<ApiResponse<User>>) => {
      if (result.type === "error") {
        toast.error(result.error?.message)

        return
      }

      toast.success(result.value?.message)

      const newUsers = userToEdit
        ? users?.data.map((user) =>
            user.username === userToEdit?.username ? result.value.data : user
          )
        : [...(users?.data || []), result.value?.data]

      refresh(newUsers)
      setUserToEdit(undefined)
      onClose()
    },
    [onClose, refresh, userToEdit, users?.data]
  )

  const handleClose = useCallback(() => {
    setUserToEdit(undefined)
    onClose()
  }, [onClose])

  const renderUserItem = useCallback(
    (user: User) => (
      <UserItem user={user} onEdit={onEdit} onDelete={onDelete} />
    ),
    [onDelete, onEdit]
  )

  return (
    <>
      <PageHeader title="Gerenciar Usuários">
        <HStack spacing={2}>
          <RefreshButton refresh={mutate} />
          <Button onClick={onOpen}>Novo Usuário</Button>
        </HStack>
      </PageHeader>

      <ListView<User>
        items={users?.data}
        render={renderUserItem}
        isLoading={isLoading || isValidating}
      />

      <UserModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={onSubmit}
        user={userToEdit}
      />
    </>
  )
}

export default Usuarios
