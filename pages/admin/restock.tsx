import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  Zoom,
} from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import { Create } from '@material-ui/icons'
import DefaultInput from '@root/components/DefaultInput'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { adminMenus } from '@root/data/menus'
import { Barang, Restock as RestockType } from '@root/data/types'
import useControlledInput from '@root/hooks/useControlledInput'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import admin from 'firebase-admin'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { GetServerSideProps, NextPage } from 'next'
import { Key, useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'merk', width: 150, headerName: 'Merk' },
  { field: 'harga', width: 150, headerName: 'Harga' },
  { field: 'stok', width: 150, headerName: 'Stok' },
  { field: 'distributor', width: 150, headerName: 'Distributor' },
  { field: 'ket', width: 150, headerName: 'Keterangan' },
]

type RestockProps = {
  barang: { barang: Barang; id: Key }[]
}

const Restock: NextPage<RestockProps> = ({ barang }) => {
  const [isEditDialogOpen, openEditDialog, closeEditDialog] = useToggler()

  const [stok, setStok, clearStok] = useControlledInput()
  const [selection, setSelection] = useState<Key[]>([])

  const [canBeEdited, showEdit, hideEdit] = useToggler()

  function editSelection() {
    const data: RestockType = {
      idBarang: selection[0].toString(),
      jumlah: parseInt(stok),
      namaBarang: barang.find(brg => brg.id === selection[0].toString()).barang
        .nama,
      tanggalMasuk: firebase.firestore.FieldValue.serverTimestamp(),
    }

    firebase
      .firestore()
      .collection('restock')
      .doc(selection[0].toString())
      .set(data)

    closeEditDialog()
  }

  useEffect(() => {
    selection.length === 1 ? showEdit() : hideEdit()
  }, [selection])

  return (
    <NeedRole role='admin'>
      <NavWithDrawer menus={adminMenus} />
      <Container className={utils.marginTop2}>
        <Grid container>
          <Grid item xs={12}>
            <div className={utils.fullWidth}>
              <DataGrid
                columns={columns}
                rows={barang.map(brg => {
                  const displayData: RowData & Barang = {
                    id: brg.id,
                    ...brg.barang,
                  }

                  return displayData
                })}
                className={classes.dataGrid}
                pagination
                pageSize={9}
                checkboxSelection
                onSelectionChange={({ rowIds }) => setSelection(rowIds)}
              />
            </div>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Tambah Barang</DialogTitle>

        <DialogContent>
          <DefaultInput
            type='number'
            label='Stok'
            fullWidth
            value={stok}
            onChange={setStok}
            className={utils.marginBot2}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={editSelection}>Save</Button>
          <Button>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Zoom in={canBeEdited}>
        <Fab
          className={`${classes.fabEdit} ${utils.lolz}`}
          onClick={openEditDialog}
          size='medium'
        >
          <Create />
        </Fab>
      </Zoom>
    </NeedRole>
  )
}

export default Restock

const serviceAccount = require('@root/serviceAccount')

export const getServerSideProps: GetServerSideProps<RestockProps> = async () => {
  if (!admin.apps.length)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://point-of-sales-pts.firebaseio.com',
    })

  const db = admin.firestore()

  const snapshot = await db.collection('barang').get()
  const barang = snapshot.docs.map(doc => ({
    barang: doc.data() as Barang,
    id: doc.id,
  }))

  return {
    props: {
      barang,
    },
  }
}
