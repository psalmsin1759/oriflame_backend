// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import moment from 'moment'

import axios from '../../../api/axios'
import { useAuth } from 'src/hooks/useAuth'
import qs from 'qs'

const ChurchLeeds = () => {
  const auth = useAuth()
  const user = auth.user
  const churchID = user.church_id

  //delete
  const [selectedRow, setSelectedRow] = useState(0)

  const [open, setOpen] = useState(false)

  const deleteRow = async id => {
    setSelectedRow(id)
    setOpen(true)
  }

  const handleNoDialog = () => {
    setOpen(false)
  }

  const handleYesDialog = async () => {
    const input = {
      id: selectedRow
    }

    const URL = '/dashboard/deleteLeeds'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    reloadData()

    setOpen(false)
  }

  const [data, setData] = useState([])

  const URL = '/dashboard/getChurchLeeds'

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

  const columns = [
    {
      flex: 0.1,
      minWidth: 250,
      field: 'church_name',
      headerName: 'Church Name'
    },

    {
      flex: 0.1,
      minWidth: 250,
      field: 'contact_name',
      headerName: 'Contact Name'
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'phone',
      headerName: 'Phone'
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email'
    },

    {
      flex: 0.2,
      minWidth: 150,
      field: 'staff_email',
      headerName: 'Staff'
    },

    {
      field: 'created_at',
      headerName: 'Date',
      width: 180,
      renderCell: params => {
        const newDate = moment(params.value).format('DD MMM, YYYY hh:mm')

        return <>{newDate}</>
      }
    },
    {
      sortable: false,
      field: 'actions',
      headerName: '',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => deleteRow(row.id)}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <CardContent>
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={data} pageSize={20} />
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
          <DialogContentText id='alert-dialog-description'>Are you sure you want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleNoDialog}>No</Button>
          <Button onClick={handleYesDialog}>Yes</Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  )
}

export default ChurchLeeds
