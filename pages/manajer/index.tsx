import MenuPage from '@root/components/MenuPage'
import NeedRole from '@root/components/NeedRole'
import { manajerMenus } from '@root/data/menus'
import { NextPage } from 'next'

const ManajerMenu: NextPage = () => {
  return (
    <NeedRole role='manajer'>
      <MenuPage menus={manajerMenus} />
    </NeedRole>
  )
}

export default ManajerMenu
