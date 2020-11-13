import { Timestamp } from '@google-cloud/firestore'
import { Container, Grid } from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { manajerMenus } from '@root/data/menus'
import { Restock as RestockType } from '@root/data/types'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import { useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'namaBarang', width: 200, headerName: 'Nama Barang' },
  { field: 'tanggalMasuk', width: 200, headerName: 'Tanggal' },
  { field: 'jumlah', width: 200, headerName: 'Jumlah' },
]

export default function Restock() {
  const [distributors, setDistributors] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const listenToDistributors = () =>
    firebase
      .firestore()
      .collection('restock')
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
                  const distributor = snapshot.data() as RestockType

                  const displayData: RowData & RestockType = {
                    id: snapshot.id,
                    ...distributor,
                    tanggalMasuk: new firebase.firestore.Timestamp(
                      (distributor.tanggalMasuk as Timestamp).seconds,
                      (distributor.tanggalMasuk as Timestamp).nanoseconds
                    )
                      .toDate()
                      .toUTCString(),
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
