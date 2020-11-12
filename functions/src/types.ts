import firebase from 'firebase/app'

export type User = Pick<
  firebase.User,
  'email' | 'displayName' | 'photoURL' | 'uid'
> & { role: Role }

export type Role = 'admin' | 'kasir' | 'manajer'

export type Barang = {
  nama: string
  merk: string
  distributor: Distributor
  harga: number
  stok: number
  ket?: string
}

export type Restock = {
  idBarang: string
  namaBarang: string
  tanggalMasuk: firebase.firestore.FieldValue | Date
  jumlah: number
}

export type Distributor = {
  nama: string
  alamat: string
  noTelp: string
}
export type Transaksi = {
  barangTransaksi: BarangTransaksi
  totalHarga: number
  tangal: firebase.firestore.FieldValue | Date
}

export type BarangTransaksi = {
  nama: string
  harga: number
  jumlah: number
}
