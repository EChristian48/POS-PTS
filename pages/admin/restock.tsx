import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { Barang, Distributor, Restock as RestockType } from '@root/data/types'
import useControlledInput from '@root/hooks/useControlledInput'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import { NextPage } from 'next'
import { Key, useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'merk', width: 150, headerName: 'Merk' },
  { field: 'harga', width: 150, headerName: 'Harga' },
  { field: 'stok', width: 150, headerName: 'Stok' },
  { field: 'distributor', width: 150, headerName: 'Distributor' },
  { field: 'ket', width: 150, headerName: 'Keterangan' },
]

const Restock: NextPage = () => {
  const [isEditDialogOpen, openEditDialog, closeEditDialog] = useToggler()

  const [stok, setStok, clearStok] = useControlledInput()
  const [selection, setSelection] = useState<Key[]>([])
  const [barangs, setBarangs] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const [canBeEdited, showEdit, hideEdit] = useToggler()

  const listenToBarangs = () =>
    firebase
      .firestore()
      .collection('barang')
      .onSnapshot(snapshot => setBarangs(snapshot.docs))

  useEffect(() => listenToBarangs(), [])

  useEffect(() => {
    selection.length === 1 ? showEdit() : hideEdit()
  }, [selection])

  function saveRestock() {
    const data: RestockType = {
      idBarang: selection[0].toString(),
      jumlah: parseInt(stok),
      namaBarang: (barangs
        .find(barang => barang.id.toString() === selection[0].toString())
        .data() as Barang).nama,
      tanggalMasuk: firebase.firestore.FieldValue.serverTimestamp(),
    }

    firebase.firestore().collection('restock').add(data)
    clearStok()
    closeEditDialog()
  }

  return (
    <NeedRole role='admin'>
      <NavWithDrawer menus={adminMenus} />
      <Container className={utils.marginTop2}>
        <Grid container>
          <Grid item xs={12}>
            <div className={utils.fullWidth}>
              <DataGrid
                columns={columns}
                rows={barangs.map(snapshot => {
                  const barang = snapshot.data() as Barang

                  const displayData: RowData & Barang = {
                    id: snapshot.id,
                    ...barang,
                    distributor: (barang.distributor as Distributor).nama,
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
        <DialogTitle>Tambah Stok</DialogTitle>

        <DialogContent>
          <DialogContentText>Kalo delay karena pake trigger</DialogContentText>

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
          <Button onClick={saveRestock}>Save</Button>
          <Button onClick={closeEditDialog}>Cancel</Button>
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
