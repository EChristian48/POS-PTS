import { Container, Grid } from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { manajerMenus } from '@root/data/menus'
import { Distributor as DistributorType } from '@root/data/types'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import { useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'alamat', width: 150, headerName: 'Alamat' },
  { field: 'noTelp', width: 150, headerName: 'No Telp' },
]

export default function Distributor() {
  const [distributors, setDistributors] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const listenToDistributors = () =>
    firebase
      .firestore()
      .collection('distributor')
      .onSnapshot(snapshot => setDistributors(snapshot.docs))

  useEffect(() => listenToDistributors(), [])

  return (
    <NeedRole role='manajer'>
      <NavWithDrawer menus={manajerMenus} />
      <Container className={utils.marginTop2}>
        <Grid container>
          <Grid item xs={12}>
            <div className={utils.fullWidth}>
              <DataGrid
                columns={columns}
                rows={distributors.map(snapshot => {
                  const distributor = snapshot.data() as DistributorType

                  const displayData: RowData & DistributorType = {
                    id: snapshot.id,
                    ...distributor,
                  }

                  return displayData
                })}
                className={classes.dataGrid}
                pagination
                pageSize={9}
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </NeedRole>
  )
}
