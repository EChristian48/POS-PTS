import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import CRUDButtons from '@root/components/CRUDButtons'
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
  distributors: { id: Key; distributor: Distributor }[]
}

const Barang: NextPage<BarangProps> = ({ distributors }) => {
  const [isDialogOpen, openDialog, closeDialog] = useToggler()
  const [isLoading, startLoading, stopLoading] = useToggler(false)

  const [barangs, setBarangs] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const [mode, setMode] = useState<'edit' | 'create'>('create')

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

  async function deleteSelections() {
    startLoading()
    await Promise.allSettled(
      selection.map(selected =>
        firebase
          .firestore()
          .collection('barang')
          .doc(selected.toString())
          .delete()
      )
    )
    stopLoading()
  }

  function saveBarang() {
    const data: BarangType = {
      harga: parseInt(harga),
      merk,
      nama,
      stok: mode === 'create' ? 0 : parseInt(stok),
      ket,
      distributor: JSON.parse(distributor),
    }

    mode === 'create'
      ? firebase.firestore().collection('barang').add(data)
      : firebase
          .firestore()
          .collection('barang')
          .doc(selection[0].toString())
          .set(data)

    closeDialog()
    clearAll()
  }

  function openEditDialog() {
    setMode('edit')
    openDialog()
  }

  function openSaveDialog() {
    setMode('create')
    openDialog()
  }

  useEffect(() => {
    selection.length ? showDelete() : hideDelete()
    selection.length === 1 ? showEdit() : hideEdit()
  }, [selection])

  const listenToBarangs = () =>
    firebase
      .firestore()
      .collection('barang')
      .onSnapshot(snapshot => setBarangs(snapshot.docs))

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

          {mode === 'edit' && (
            <DefaultInput
              type='number'
              label='Stok'
              fullWidth
              value={stok}
              onChange={setStok}
              className={utils.marginBot2}
            />
          )}

          <FormControl
            variant='filled'
            className={classes.formControl}
            fullWidth
          >
            <InputLabel>Distributor</InputLabel>
            <Select value={distributor} onChange={handleDistributorChange}>
              {distributors.map(({ distributor, id }) => (
                <MenuItem value={JSON.stringify(distributor)} key={id}>
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

      <CRUDButtons
        deleteTrigger={canBeDeleted}
        editTrigger={canBeEdited}
        onDelete={deleteSelections}
        onEdit={openEditDialog}
        onSave={openSaveDialog}
      />
    </NeedRole>
  )
}

export default Barang

export const getServerSideProps: GetServerSideProps<BarangProps> = async () => {
  const snapshot = await firebase.firestore().collection('distributor').get()
  const distributors = snapshot.docs.map(doc => ({
    id: doc.id,
    distributor: doc.data() as Distributor,
  }))

  return {
    props: {
      distributors,
    },
  }
}
