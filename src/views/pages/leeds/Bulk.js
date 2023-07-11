// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'

import axios from '../../../api/axios'
import { useAuth } from 'src/hooks/useAuth'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import LoadingButton from '@mui/lab/LoadingButton'

const Bulk = () => {
  const auth = useAuth()
  const user = auth.user

  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const [buttonLoading, setButtonLoading] = useState(false)

  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    setButtonLoading(true)

    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const URL = '/uploadchurchleeds'

    try {
      const response = await axios.post(URL, formData, {
        Headers: { 'content-type': 'multipart/form-data' }
      })

      if (response?.data.status === 'success') {
        setFile(null)
        setError(null)

        setButtonLoading(false)

        setSeverity('success')
        setOutputValue('successful')
        setOpen1(true)
      } else {
        setError(result.error)

        setButtonLoading(false)
        setSeverity('error')
        setOpen1(true)
        setOutputValue('Error')
      }
    } catch (error) {
      setError('An error occurred while uploading the file.')
      setButtonLoading(false)
    }
  }

  const [loading, setLoading] = useState(false)

  return (
    <CardContent>
      <form onSubmit={e => e.preventDefault()}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box sx={{ mb: 6 }}>
              <Collapse in={open1}>
                <Alert
                  severity={severity}
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen1(false)}>
                      <Close fontSize='inherit' />
                    </IconButton>
                  }
                >
                  {outputValue}
                </Alert>
              </Collapse>
              {/* <Button disabled={open1} variant='outlined' sx={{ mt: 2 }} onClick={() => setOpen1(true)}>
                    Open Collapse
                  </Button> */}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Upload Excel File
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Grid item xs={12} sm={6}>
              <TextField
                required={true}
                onChange={handleFileChange}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                fullWidth
                type='file'
                label=''
                placeholder='Church Tracker File'
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <LoadingButton
              loading={buttonLoading}
              loadingPosition='start'
              onClick={handleSubmit}
              size='large'
              type='submit'
              sx={{ mr: 2 }}
              variant='contained'
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default Bulk
