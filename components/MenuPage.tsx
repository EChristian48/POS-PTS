import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@material-ui/core'
import NavWithDrawer from '@root/components/NavWithDrawer'
import { Menu } from '@root/data/menus'
import classes from '@root/styles/utils.module.css'
import { FC } from 'react'
import LinkWrapper from './LinkWrapper'

const MenuPage: FC<{ menus: Menu[] }> = ({ menus }) => {
  return (
    <>
      <NavWithDrawer menus={menus} />

      <Container className={classes.marginTop2}>
        <Grid container spacing={2}>
          {menus.map(({ href, icon: Icon, name }) => (
            <Grid item key={name} xs={12}>
              <LinkWrapper nextProps={{ href }}>
                <Card variant='outlined'>
                  <CardContent>
                    <Icon />
                    <Typography>{name}</Typography>
                  </CardContent>
                </Card>
              </LinkWrapper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default MenuPage
