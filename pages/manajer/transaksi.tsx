import { Timestamp } from '@google-cloud/firestore'
import { Container, Grid } from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { manajerMenus } from '@root/data/menus'
import { Restock as RestockType, Transaksi } from '@root/data/types'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import { useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'barangTransaksi', width: 200, headerName: 'Barang' },
  { field: 'totalHarga', width: 200, headerName: 'Total Harga' },
  { field: 'tangal', width: 200, headerName: 'Tangal' },
]

export default function Restock() {
  const [distributors, setDistributors] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const listenToDistributors = () =>
    firebase
      .firestore()
      .collection('transaksi')
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
                  const distributor = snapshot.data() as Transaksi

                  const displayData: RowData & Transaksi = {
                    id: snapshot.id,
                    ...distributor,
                    barangTransaksi: distributor.barangTransaksi.reduce(
                      (acc, cur) => acc + `${cur.nama} x ${cur.jumlah}`,
                      ''
                    ) as any,
                    tangal: new firebase.firestore.Timestamp(
                      (distributor.tangal as Timestamp).seconds,
                      (distributor.tangal as Timestamp).nanoseconds
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
