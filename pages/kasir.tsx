import { Transaction } from '@google-cloud/firestore'
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Zoom,
} from '@material-ui/core'
import { ColDef, DataGrid, RowData } from '@material-ui/data-grid'
import { ArrowForward, Delete, Save } from '@material-ui/icons'
import { TabContext, TabPanel } from '@material-ui/lab'
import DefaultInput from '@root/components/DefaultInput'
import NavWithDrawer from '@root/components/NavWithDrawer'
import NeedRole from '@root/components/NeedRole'
import { kasirMenus } from '@root/data/menus'
import { Barang, Distributor, Transaksi } from '@root/data/types'
import { BarangTransaksi } from '@root/functions/src/types'
import useControlledInput from '@root/hooks/useControlledInput'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Key, useEffect, useState } from 'react'

const columns: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'merk', width: 150, headerName: 'Merk' },
  { field: 'harga', width: 150, headerName: 'Harga' },
  { field: 'stok', width: 150, headerName: 'Stok' },
  { field: 'distributor', width: 150, headerName: 'Distributor' },
  { field: 'ket', width: 150, headerName: 'Keterangan' },
]

const columns2: ColDef[] = [
  { field: 'nama', width: 150, headerName: 'Nama' },
  { field: 'merk', width: 150, headerName: 'Merk' },
  { field: 'harga', width: 150, headerName: 'Harga' },
  { field: 'stok', width: 150, headerName: 'Jumlah' },
  { field: 'distributor', width: 150, headerName: 'Distributor' },
  { field: 'ket', width: 150, headerName: 'Keterangan' },
]

export default function Kasir() {
  const [barangs, setBarangs] = useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]
  >([])

  const [keranjang, setKeranjang] = useState<
    {
      jumlah: number
      barang: firebase.firestore.QueryDocumentSnapshot<
        firebase.firestore.DocumentData
      >
    }[]
  >([])

  const [selection, setSelection] = useState<Key[]>([])
  const [selection2, setSelection2] = useState<Key[]>([])
  const [tab, setTab] = useState('1')

  const handleTabChange = (e: any, tab: string) => setTab(tab)

  const listenToBarangs = () =>
    firebase
      .firestore()
      .collection('barang')
      .onSnapshot(snapshot => setBarangs(snapshot.docs))

  useEffect(() => listenToBarangs(), [])

  const [canBeMoved, showMove, hideMove] = useToggler()
  const [canBeDeleted, showDelete, hideDelete] = useToggler()
  const [isDialogOpen, showDialog, closeDialog] = useToggler()
  const [stok, setStok, clearStok] = useControlledInput()

  useEffect(() => {
    selection.length === 1 ? showMove() : hideMove()
  }, [selection])

  useEffect(() => {
    selection2.length ? showDelete() : hideDelete()
  }, [selection2])

  function moveToCart() {
    setKeranjang([
      ...keranjang,
      {
        barang: barangs.find(barang => barang.id === selection[0]),
        jumlah: parseInt(stok),
      },
    ])
    setSelection([])
    closeDialog()
  }

  const [isLoadingDelete, showLoading, stopLoading] = useToggler()
  function deleteSelection() {
    showLoading()

    setTimeout(() => {
      setKeranjang(
        keranjang.filter(
          barang => !selection2.includes(barang.barang.id.toString())
        )
      )
    }, 200)

    setTimeout(stopLoading, 400)
  }

  async function saveTransaction() {
    showLoading()
    const barangTransaksi = keranjang.map(barang => {
      const { jumlah, barang: doc } = barang
      const { harga, nama } = doc.data() as Barang

      const barangTransaksi: BarangTransaksi = {
        id: doc.id,
        harga,
        nama,
        jumlah,
      }

      return barangTransaksi
    })

    const data: Transaksi = {
      barangTransaksi,
      tangal: firebase.firestore.FieldValue.serverTimestamp(),
      totalHarga: barangTransaksi.reduce(
        (acc, cur) => acc + cur.harga * cur.jumlah,
        0
      ),
    }

    await firebase.firestore().collection('transaksi').add(data)

    setKeranjang([])
    stopLoading()
  }

  return (
    <NeedRole role='kasir'>
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Mau beli berapa?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Jangan banyak-banyak entar jadi minus stoknya, belom sempet bikin
            logicnya
          </DialogContentText>

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
          <Button onClick={moveToCart}>Save</Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <NavWithDrawer menus={kasirMenus} />

      <TabContext value={tab}>
        <Container className={utils.marginTop2}>
          <Grid container>
            <Grid item xs={12}>
              <AppBar position='static'>
                <Tabs onChange={handleTabChange} value={tab}>
                  <Tab label='List Barang' value='1' />
                  <Tab label='Keranjang' value='2' />
                </Tabs>
              </AppBar>
            </Grid>

            <TabPanel value='1' className={utils.fullWidth}>
              <Grid item xs={12}>
                <Zoom in={canBeMoved}>
                  <Fab size='small' onClick={showDialog}>
                    <ArrowForward />
                  </Fab>
                </Zoom>
              </Grid>

              <Grid item xs={12}>
                <div
                  className={`${utils.fullWidth} ${classes.dataGrid} ${utils.marginTop2}`}
                >
                  <DataGrid
                    columns={columns}
                    rows={barangs.map(snapshot => {
                      const barang = snapshot.data() as Barang

                      const displayData: RowData & Barang = {
                        id: snapshot.id.toString(),
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
            </TabPanel>

            <TabPanel value='2' className={utils.fullWidth}>
              <Grid item xs={12}>
                <Zoom in={canBeDeleted}>
                  <Fab size='small' onClick={deleteSelection}>
                    <Delete />
                  </Fab>
                </Zoom>

                <Fab size='small' onClick={saveTransaction}>
                  <Save />
                </Fab>
              </Grid>

              <Grid item xs={12}>
                <div
                  className={`${utils.fullWidth} ${classes.dataGrid} ${utils.marginTop2}`}
                >
                  {isLoadingDelete ? (
                    <CircularProgress />
                  ) : (
                    <DataGrid
                      columns={columns2}
                      rows={keranjang.map(item => {
                        const { barang, jumlah } = item
                        const barangData = barang.data() as Barang

                        const displayData: RowData & Barang = {
                          id: barang.id.toString(),
                          ...barangData,
                          stok: jumlah,
                          distributor: (barangData.distributor as Distributor)
                            .nama,
                        }

                        return displayData
                      })}
                      className={classes.dataGrid}
                      pagination
                      pageSize={9}
                      checkboxSelection
                      onSelectionChange={({ rowIds }) => setSelection2(rowIds)}
                    />
                  )}
                </div>
              </Grid>
            </TabPanel>
          </Grid>
        </Container>
      </TabContext>
    </NeedRole>
  )
}
