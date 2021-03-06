import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { Barang, Restock, Transaksi, User } from './types'

admin.initializeApp()

const db = admin.firestore()

export const createUserDocument = functions.auth
  .user()
  .onCreate(({ email, uid, photoURL, displayName }) => {
    const user: User = {
      email: email as any,
      photoURL: photoURL as any,
      displayName: displayName as any,
      uid,
      role: 'kasir',
    }

    return db.collection('users').doc(uid).set(user)
  })

export const deleteUserDocument = functions.auth
  .user()
  .onDelete(({ uid }) => db.collection('users').doc(uid).delete())

export const updateStok = functions.firestore
  .document('restock/{restockId}')
  .onCreate(async snap => {
    const restock = snap.data() as Restock

    const querySnap = await db.collection('barang').doc(restock.idBarang).get()
    const originalData = querySnap.data() as Barang

    return db
      .collection('barang')
      .doc(restock.idBarang)
      .set({ ...originalData, stok: originalData.stok + restock.jumlah })
  })

export const kurangiStok = functions.firestore
  .document('transaksi/{transaksiId}')
  .onCreate(async snap => {
    const transaksi = snap.data() as Transaksi

    for (const barang of transaksi.barangTransaksi) {
      const barangRef = db.collection('barang').doc(barang.id)
      db.runTransaction(async tr => {
        const docSnap = await tr.get(barangRef)
        const oldStock = (docSnap.data() as Barang).stok
        const newStock = oldStock - barang.jumlah

        return tr.update(barangRef, { stok: newStock })
      })
    }
  })
