import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import { Menu as MenuType } from '@root/data/menus'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/components/NavWithDrawer.module.css'
import firebase from 'firebase/app'
import router from 'next/router'
import { FC } from 'react'
import LoadingPage from './LoadingPage'

const NavWithDrawer: FC<{ menus: MenuType[] }> = ({ menus }) => {
  const [isDrawerOpen, openDrawer, closeDrawer] = useToggler()
  const [isLoading, startLoading] = useToggler()

  async function logout() {
    startLoading()
    await firebase.auth().signOut()
    router.push('/login')
  }

  return isLoading ? (
    <LoadingPage>Logging out...</LoadingPage>
  ) : (
    <>
      <AppBar position='sticky'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            onClick={openDrawer}
          >
            <Menu />
          </IconButton>

          <Typography>POS buat PTS</Typography>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={openDrawer}
      >
        <List className={classes.list}>
          {menus.map(menu => (
            <ListItem button key={menu.name} component='a' href={menu.href}>
              <ListItemIcon>
                <menu.icon />
              </ListItemIcon>

              <ListItemText primary={menu.name} />
            </ListItem>
          ))}
          <ListItem button onClick={logout}>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  )
}

export default NavWithDrawer
