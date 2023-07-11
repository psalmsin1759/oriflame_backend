// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Collapse from '@mui/material/Collapse'
import toast from 'react-hot-toast'

import qs from 'qs'

import axios from '../../../api/axios'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAuth } from 'src/hooks/useAuth'

import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const defaultValues = {
  email: '',
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
  email: yup
    .string()
    .min(3, obj => showErrors('Sender', obj.value.length, obj.min))
    .required(),
  subject: yup
    .string()
    .min(3, obj => showErrors('Phone', obj.value.length, obj.min))
    .required(),
  message: yup
    .string()
    .min(3, obj => showErrors('Message', obj.value.length, obj.min))
    .max(160, obj => showErrors('Message', obj.value.length, obj.max))
    .required()
})

const SingleSMSSend = () => {
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

  const [buttonLoading, setButtonLoading] = useState(false)

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      email: data.email,
      subject: data.subject,
      message: message,
      adminid: adminID
    }

    const URL = '/dashboard/sendAdminEmail'

    try {
      const response = await axios.post(URL, qs.stringify(input), {
        Headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })

      if (response?.data.status === '200') {
        reset()

        if (quill) {
          quill.setText('')
        }

        setButtonLoading(false)

        setSeverity('success')
        setOutputValue('Email successfully sent')
        setOpen1(true)

        toast.success('Email Sent!')
      } else {
        setButtonLoading(false)
        setSeverity('error')
        setOpen1(true)
        setOutputValue(response?.data.message)
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
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
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

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Email'
                    onChange={onChange}
                    fullWidth
                    placeholder='Email'
                    error={Boolean(errors.email)}
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
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
                    placeholder='Subject'
                    onChange={onChange}
                    fullWidth
                    error={Boolean(errors.subject)}
                  />
                )}
              />
              {errors.subject && <FormHelperText sx={{ color: 'error.main' }}>{errors.subject.message}</FormHelperText>}
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

export default SingleSMSSend
