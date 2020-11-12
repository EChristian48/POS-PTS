import MenuPage from '@root/components/MenuPage'
import NeedRole from '@root/components/NeedRole'
import { adminMenus } from '@root/data/menus'
import useToggler from '@root/hooks/useToggler'
import { NextPage } from 'next'

const AdminMenu: NextPage = () => {
  const [isDrawerOpen, openDrawer, closeDrawer] = useToggler()

  return (
    <NeedRole role='admin'>
      <MenuPage menus={adminMenus} />
    </NeedRole>
  )
}

export default AdminMenu
