import { useCallback, useEffect, useState } from 'react'
import { getStudent, getStudents } from './students.js'
import { databaseError, isDatabaseConfigured, SETUP_MESSAGE } from '../lib/db.js'

export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isDatabaseConfigured) {
      setStudents([])
      setError(SETUP_MESSAGE)
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      setStudents(await getStudents())
    } catch (err) {
      setError(databaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { students, loading, error, reload: load }
}

export function useStudent(id) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    if (!isDatabaseConfigured) {
      setError(SETUP_MESSAGE)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError('')
    getStudent(id)
      .then((value) => {
        if (active) setStudent(value)
      })
      .catch((err) => {
        if (active) setError(databaseError(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  return { student, loading, error }
}
