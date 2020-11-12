import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { kasirMenus } from '@root/data/menus'

export default function Kasir() {
  return (
    <NeedRole role='kasir'>
      <NavWithDrawer menus={kasirMenus} />
    </NeedRole>
  )
}
