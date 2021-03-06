import firebase from 'firebase/app'

export type User = Pick<
  firebase.User,
  'email' | 'displayName' | 'photoURL' | 'uid'
> & { role: Role }

export type Role = 'admin' | 'kasir' | 'manajer'

export type Barang = {
  nama: string
  merk: string
  distributor: Distributor | string
  harga: number
  stok: number
  ket?: string
}

export type Restock = {
  idBarang: string
  namaBarang: string
  tanggalMasuk: firebase.firestore.FieldValue | Date | string
  jumlah: number
}

export type Distributor = {
  nama: string
  alamat: string
  noTelp: string
}
export type Transaksi = {
  barangTransaksi: BarangTransaksi[]
  totalHarga: number
  tangal: firebase.firestore.FieldValue | Date | string
}

export type BarangTransaksi = {
  id: string
  nama: string
  harga: number
  jumlah: number
}
