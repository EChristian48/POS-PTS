import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import CRUDButtons from '@root/components/CRUDButtons'
import DefaultInput from '@root/components/DefaultInput'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { adminMenus } from '@root/data/menus'
import { Distributor as DistributorType } from '@root/data/types'
import useControlledInput from '@root/hooks/useControlledInput'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Key, useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'alamat', width: 150, headerName: 'Alamat' },
  { field: 'noTelp', width: 150, headerName: 'No Telp' },
]

export default function Distributor() {
  const [isDialogOpen, openDialog, closeDialog] = useToggler()
  const [isLoading, startLoading, stopLoading] = useToggler(false)
  const [mode, setMode] = useState<'edit' | 'create'>('create')

  const [distributors, setDistributors] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const [nama, setNama, clearNama] = useControlledInput()
  const [alamat, setAlamat, clearAlamat] = useControlledInput()
  const [noTelp, setNoTelp, clearNoTelp] = useControlledInput()

  const [selection, setSelection] = useState<Key[]>([])

  const [canBeDeleted, showDelete, hideDelete] = useToggler()
  const [canBeEdited, showEdit, hideEdit] = useToggler()

  const listenToDistributors = () =>
    firebase
      .firestore()
      .collection('distributor')
      .onSnapshot(snapshot => {
        setDistributors(snapshot.docs)
      })

  async function deleteSelections() {
    startLoading()
    await Promise.allSettled(
      selection.map(selected =>
        firebase
          .firestore()
          .collection('distributor')
          .doc(selected.toString())
          .delete()
      )
    )
    stopLoading()
  }

  function saveDistributor() {
    const data: DistributorType = {
      noTelp,
      alamat,
      nama,
    }

    if (mode === 'create') {
      firebase.firestore().collection('distributor').add(data)
    } else {
      firebase
        .firestore()
        .collection('distributor')
        .doc(selection[0].toString())
        .set(data)
    }

    closeDialog()
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

  useEffect(() => listenToDistributors(), [])

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
                  checkboxSelection
                  onSelectionChange={({ rowIds }) => setSelection(rowIds)}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </Container>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Tambah Distributor</DialogTitle>

        <DialogContent>
          <DefaultInput
            label='Nama'
            fullWidth
            className={utils.marginBot2}
            value={nama}
            onChange={setNama}
          />

          <DefaultInput
            multiline
            label='Alamat'
            fullWidth
            className={utils.marginBot2}
            value={alamat}
            onChange={setAlamat}
          />

          <DefaultInput
            type='number'
            label='No Telpon'
            fullWidth
            value={noTelp}
            onChange={setNoTelp}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={saveDistributor}>Save</Button>
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
