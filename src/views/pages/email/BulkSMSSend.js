// ** React Imports
import { useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Close from 'mdi-material-ui/Close'
import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
import qs from 'qs'

import axios from '../../../api/axios'

import Select from '@mui/material/Select'

import toast from 'react-hot-toast'

import LoadingButton from '@mui/lab/LoadingButton'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { useAuth } from 'src/hooks/useAuth'

import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const defaultValues = {
  subject: '',
  message: ''
}

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  subject: yup
    .string()
    .min(3, obj => showErrors('Subject', obj.value.length, obj.min))
    .required(),

  message: yup
    .string()
    .min(3, obj => showErrors('Message', obj.value.length, obj.min))
    .max(160, obj => showErrors('Message', obj.value.length, obj.max))
    .required()
})

const BulkSMSSend = () => {
  const auth = useAuth()
  const user = auth.user
  const adminID = user?.id

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { quill, quillRef } = useQuill()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        setMessage(quill.root.innerHTML)

        console.log('Text change!')
        console.log(quill.getText()) // Get text only
        console.log(quill.getContents()) // Get delta contents
        console.log(quill.root.innerHTML) // Get innerHTML using quill
        console.log(quillRef.current.firstChild.innerHTML) // Get innerHTML using quillRef
      })
    }
  }, [quill])

  const [sendto, setSendTo] = useState('1')

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      sender: data.subject,
      message: message,
      adminid: adminID
    }
    const URL = '/dashboard/sendBulkAdminEmail'

    try {
      const response = await axios.post(URL, qs.stringify(input), {
        Headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })

      if (response?.data.status === '200') {
        setSeverity('success')
        setOutputValue('Messsage Sent')
        setOpen1(true)

        reset()

        if (quill) {
          quill.setText('')
        }

        setButtonLoading(false)

        toast.success('Sent!')
      } else {
        setSeverity('error')
        setOpen1(true)
        setOutputValue('Error occurred')

        setButtonLoading(false)
      }
    } catch (error) {
      if ((error.response && error.response.status === 500) || error.response.status === 404) {
        setButtonLoading(false)
        setSeverity('error')
        setOpen1(true)
        setOutputValue(error.message)
      }
    }
  }
  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={5}>
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
              </Box>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='subject'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Subject'
                      onChange={onChange}
                      fullWidth
                      placeholder='Subject'
                      error={Boolean(errors.subject)}
                    />
                  )}
                />
                {errors.subject && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.subject.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Send To</InputLabel>
                <Select
                  label='SendTo'
                  defaultValue='1'
                  name='sendto'
                  onChange={e => setSendTo(e.target.value)}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {/* <MenuItem value='1'>All Mobile Users</MenuItem> */}
                  <MenuItem value='1'>All Churches</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div style={{ width: parent, height: 300 }}>
                <div ref={quillRef} />
              </div>
            </Grid>

            <Grid item xs={12} sm={12}>
              <br />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: 0 }} />
        <CardActions>
          <LoadingButton
            loading={buttonLoading}
            loadingPosition='start'
            onClick={handleSubmit}
            size='large'
            type='submit'
            sx={{ mr: 2 }}
            variant='contained'
          >
            Send
          </LoadingButton>
        </CardActions>
      </form>
    </Card>
  )
}

export default BulkSMSSend
