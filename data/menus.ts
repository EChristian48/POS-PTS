import { AccountCircle, Add, Menu, Money, Save } from '@material-ui/icons'
import { FC } from 'react'

export type Menu = {
  href: string
  name: string
  icon: FC
  description?: string
}

export const adminMenus: Menu[] = [
  { icon: Save, name: 'Barang', href: '/admin/barang' },
  { icon: Add, name: 'Restock', href: '/admin/restock' },
  { icon: AccountCircle, name: 'Distributor', href: '/admin/distributor' },
]

export const kasirMenus: Menu[] = [
  { href: '/kasir', name: 'Transaksi', icon: Money },
]
