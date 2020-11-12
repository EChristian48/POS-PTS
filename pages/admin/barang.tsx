import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Zoom,
} from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import { Add, Create, Delete } from '@material-ui/icons'
import DefaultInput from '@root/components/DefaultInput'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { adminMenus } from '@root/data/menus'
import { Barang as BarangType, Distributor } from '@root/data/types'
import useControlledInput from '@root/hooks/useControlledInput'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import admin from 'firebase-admin'
import { GetServerSideProps, NextPage } from 'next'
import { ChangeEvent, Key, useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'merk', width: 150, headerName: 'Merk' },
  { field: 'harga', width: 150, headerName: 'Harga' },
  { field: 'stok', width: 150, headerName: 'Stok' },
  { field: 'distributor', width: 150, headerName: 'Distributor' },
  { field: 'ket', width: 150, headerName: 'Keterangan' },
]

type BarangProps = {
  distributors: Distributor[]
}

const Barang: NextPage<BarangProps> = ({ distributors }) => {
  const [isDialogOpen, openDialog, closeDialog] = useToggler()
  const [isEditDialogOpen, openEditDialog, closeEditDialog] = useToggler()
  const [isLoading, startLoading, stopLoading] = useToggler(true)

  const [barangs, setBarangs] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const [nama, setNama, clearNama] = useControlledInput()
  const [merk, setMerk, clearMerk] = useControlledInput()
  const [harga, setHarga, clearHarga] = useControlledInput()
  const [stok, setStok, clearStok] = useControlledInput()
  const [ket, setKet, clearKet] = useControlledInput()
  const [distributor, setDistributor] = useState(
    JSON.stringify(distributors[0])
  )

  const handleDistributorChange = (e: ChangeEvent<{ value: string }>) =>
    setDistributor(e.target.value)

  const [selection, setSelection] = useState<Key[]>([])

  const [canBeDeleted, showDelete, hideDelete] = useToggler()
  const [canBeEdited, showEdit, hideEdit] = useToggler()

  function clearAll() {
    clearNama()
    clearMerk()
    clearHarga()
    clearStok()
    clearKet()
  }

  const listenToBarangs = () =>
    firebase
      .firestore()
      .collection('barang')
      .onSnapshot(snapshot => {
        stopLoading()
        setBarangs(snapshot.docs)
      })

  function saveBarang() {
    const data: BarangType = {
      harga: parseInt(harga),
      merk,
      nama,
      stok: 0,
      ket,
      distributor: JSON.parse(distributor),
    }

    firebase.firestore().collection('barang').add(data)
    closeDialog()
    clearAll()
  }

  function deleteSelections() {
    Promise.allSettled(
      selection.map(selected =>
        firebase
          .firestore()
          .collection('barang')
          .doc(selected.toString())
          .delete()
      )
    )
  }

  function editSelection() {
    const data: BarangType = {
      harga: parseInt(harga),
      merk,
      nama,
      stok: parseInt(stok),
      ket,
      distributor: JSON.parse(distributor),
    }

    firebase
      .firestore()
      .collection('barang')
      .doc(selection[0].toString())
      .set(data)

    closeEditDialog()
    clearAll()
  }

  useEffect(() => {
    selection.length ? showDelete() : hideDelete()
    selection.length === 1 ? showEdit() : hideEdit()
  }, [selection])

  useEffect(() => listenToBarangs(), [])

  return (
    <NeedRole role='admin'>
      <NavWithDrawer menus={adminMenus} />
      <Container className={utils.marginTop2}>
        <Grid container>
          <Grid item xs={12}>
            {isLoading ? (
              <Grid container justify='center'>
                <CircularProgress />
              </Grid>
            ) : (
              <div className={utils.fullWidth}>
                <DataGrid
                  columns={columns}
                  rows={barangs.map(snapshot => {
                    const barang = snapshot.data() as BarangType

                    const displayData: RowData & BarangType = {
                      id: snapshot.id,
                      ...barang,
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
            )}
          </Grid>
        </Grid>
      </Container>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Tambah Barang</DialogTitle>

        <DialogContent>
          <DefaultInput
            label='Nama'
            fullWidth
            className={utils.marginBot2}
            value={nama}
            onChange={setNama}
          />

          <DefaultInput
            label='Merk'
            fullWidth
            className={utils.marginBot2}
            value={merk}
            onChange={setMerk}
          />

          <DefaultInput
            type='number'
            label='Harga'
            fullWidth
            value={harga}
            onChange={setHarga}
            className={utils.marginBot2}
          />

          <DefaultInput
            label='Keterangan'
            fullWidth
            value={ket}
            onChange={setKet}
            className={utils.marginBot2}
          />

          <FormControl
            variant='filled'
            className={classes.formControl}
            fullWidth
          >
            <InputLabel>Age</InputLabel>
            <Select
              labelId='demo-simple-select-filled-label'
              id='demo-simple-select-filled'
              value={distributor}
              onChange={handleDistributorChange}
            >
              {distributors.map(distributor => (
                <MenuItem value={JSON.stringify(distributor)}>
                  {distributor.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={saveBarang}>Save</Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Tambah Barang</DialogTitle>

        <DialogContent>
          <DefaultInput
            label='Nama'
            fullWidth
            className={utils.marginBot2}
            value={nama}
            onChange={setNama}
          />

          <DefaultInput
            label='Merk'
            fullWidth
            className={utils.marginBot2}
            value={merk}
            onChange={setMerk}
          />

          <DefaultInput
            type='number'
            label='Harga'
            fullWidth
            value={harga}
            onChange={setHarga}
            className={utils.marginBot2}
          />

          <DefaultInput
            type='number'
            label='Stok'
            fullWidth
            value={stok}
            onChange={setStok}
            className={utils.marginBot2}
          />

          <DefaultInput
            label='Keterangan'
            fullWidth
            value={ket}
            onChange={setKet}
            className={utils.marginBot2}
          />

          <FormControl
            variant='filled'
            className={classes.formControl}
            fullWidth
          >
            <InputLabel>Distributor</InputLabel>
            <Select
              labelId='demo-simple-select-filled-label'
              id='demo-simple-select-filled'
              value={distributor}
              onChange={handleDistributorChange}
            >
              {distributors.map(distributor => (
                <MenuItem value={JSON.stringify(distributor)}>
                  {distributor.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={editSelection}>Save</Button>
          <Button onClick={closeDialog}>Cancel</Button>
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

      <Zoom in={canBeDeleted}>
        <Fab
          className={`${classes.fabDelete} ${utils.lolz}`}
          onClick={deleteSelections}
          size='medium'
        >
          <Delete />
        </Fab>
      </Zoom>

      <Fab
        className={`${classes.fabAdd} ${utils.lolz}`}
        onClick={openDialog}
        size='medium'
      >
        <Add />
      </Fab>
    </NeedRole>
  )
}

export default Barang

const serviceAccount = require('@root/serviceAccount')

export const getServerSideProps: GetServerSideProps<BarangProps> = async () => {
  if (!admin.apps.length)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://point-of-sales-pts.firebaseio.com',
    })

  const db = admin.firestore()

  const snapshot = await db.collection('distributor').get()
  const distributors = snapshot.docs.map(doc => doc.data() as Distributor)

  return {
    props: {
      distributors,
    },
  }
}
