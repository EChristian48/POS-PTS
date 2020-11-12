import classes from '@root/styles/admin/crud.module.css'
import utils from '@root/styles/utils.module.css'
import { Zoom, Fab } from '@material-ui/core'
import { Create, Delete, Add } from '@material-ui/icons'
import { FC } from 'react'

export type CRUDButtonsProps = {
  editTrigger: boolean
  deleteTrigger: boolean
  onEdit: () => any
  onDelete: () => any
  onSave: () => any
}

const CRUDButtons: FC<CRUDButtonsProps> = ({
  deleteTrigger,
  editTrigger,
  onDelete,
  onEdit,
  onSave,
}) => (
  <>
    <Zoom in={editTrigger}>
      <Fab
        className={`${classes.fabEdit} ${utils.lolz}`}
        onClick={onEdit}
        size='medium'
      >
        <Create />
      </Fab>
    </Zoom>

    <Zoom in={deleteTrigger}>
      <Fab
        className={`${classes.fabDelete} ${utils.lolz}`}
        onClick={onDelete}
        size='medium'
      >
        <Delete />
      </Fab>
    </Zoom>

    <Fab
      className={`${classes.fabAdd} ${utils.lolz}`}
      onClick={onSave}
      size='medium'
    >
      <Add />
    </Fab>
  </>
)

export default CRUDButtons
