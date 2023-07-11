// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

import axios from '../../../api/axios'
import { useAuth } from 'src/hooks/useAuth'
import CustomChip from 'src/@core/components/mui/chip'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteOutline from 'mdi-material-ui/ToggleSwitch'
import Refresh from 'mdi-material-ui/Refresh'
import DeleteICon from 'mdi-material-ui/DeleteOutline'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import qs from 'qs'

const ViewGames = () => {
  const auth = useAuth()
  const user = auth.user

  //const [walletBalance, setWalletBalance] = useState(200)

  const [data, setData] = useState([])

  const URL = '/getGames'

  useEffect(() => {
    // Call the function
    reloadData()
  }, [])

  const reloadData = async () => {
    const response = await axios.get(URL, {
      Headers: { 'content-type': "'application/json" }
    })

    setData(response?.data.data)
  }

  //delete
  const [selectedRow, setSelectedRow] = useState(0)

  const [open, setOpen] = useState(false)

  const [openReset, setOpenReset] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)

  const deleteRow = async id => {
    setSelectedRow(id)
    setOpen(true)
  }

  const resetRow = async id => {
    setSelectedRow(id)
    setOpenReset(true)
  }

  const deleteGameRow = async id => {
    setSelectedRow(id)
    setOpenDelete(true)
  }

  const handleDeleteNoDialog = () => {
    setOpenDelete(false)
  }

  const handleDeleteYesDialog = async () => {
    const input = {
      id: selectedRow
    }

    const URL = '/deleteGame'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    reloadData()

    setOpenDelete(false)

    alert('Reset Successful')
  }

  const handleResetNoDialog = () => {
    setOpenReset(false)
  }

  const handleResetYesDialog = async () => {
    const input = {
      id: selectedRow
    }

    const URL = '/resetGame'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    reloadData()

    setOpenReset(false)

    alert('Reset Successful')
  }

  const handleNoDialog = () => {
    setOpen(false)
  }

  const handleYesDialog = async () => {
    const input = {
      id: selectedRow
    }

    const URL = '/toggleGameStatus'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    reloadData()

    setOpen(false)
  }

  const columns = [
    {
      flex: 0.15,
      minWidth: 200,
      field: 'name',
      headerName: 'Name'
    },
    {
      flex: 0.15,
      field: 'number_of_winners',
      minWidth: 100,
      headerName: 'Number Of Winners'
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: params => {
        const color = params.value == 1 ? 'success' : 'warning'
        const status = params.value == 0 ? 'InActive' : 'Active'
        return (
          <CustomChip
            skin='light'
            size='small'
            label={status}
            color={color}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },

    {
      sortable: false,
      field: 'actions',
      minWidth: 150,
      headerName: '',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Active/InActive'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => deleteRow(row.id)}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='Reset Game'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => resetRow(row.id)}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete Game'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => deleteGameRow(row.id)}>
              <DeleteICon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <CardContent>
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={data} pageSize={12} />
      </Box>

      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleNoDialog()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to toggle the status?
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleNoDialog}>No</Button>
          <Button onClick={handleYesDialog}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReset}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleResetNoDialog()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to reset the Game? This will reset the eligibility status for all players in the game.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleResetNoDialog}>No</Button>
          <Button onClick={handleResetYesDialog}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleDeleteNoDialog()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this Game? This will also delete all the players attached to this game
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleDeleteNoDialog}>No</Button>
          <Button onClick={handleDeleteYesDialog}>Yes</Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  )
}

export default ViewGames
