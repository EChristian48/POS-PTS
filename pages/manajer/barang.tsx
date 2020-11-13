import { Container, Grid } from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { manajerMenus } from '@root/data/menus'
import { Barang as BarangType, Distributor } from '@root/data/types'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'merk', width: 150, headerName: 'Merk' },
  { field: 'harga', width: 150, headerName: 'Harga' },
  { field: 'stok', width: 150, headerName: 'Stok' },
  { field: 'distributor', width: 150, headerName: 'Distributor' },
  { field: 'ket', width: 150, headerName: 'Keterangan' },
]

const Barang: NextPage = () => {
  const [barangs, setBarangs] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const listenToBarangs = () =>
    firebase
      .firestore()
      .collection('barang')
      .onSnapshot(snapshot => setBarangs(snapshot.docs))

  useEffect(() => listenToBarangs(), [])

  return (
    <NeedRole role='manajer'>
      <NavWithDrawer menus={manajerMenus} />
      <Container className={utils.marginTop2}>
        <Grid container>
          <Grid item xs={12}>
            <div className={utils.fullWidth}>
              <DataGrid
                columns={columns}
                rows={barangs.map(snapshot => {
                  const barang = snapshot.data() as BarangType

                  const displayData: RowData & BarangType = {
                    id: snapshot.id,
                    ...barang,
                    distributor: (barang.distributor as Distributor).nama,
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

export default Barang
