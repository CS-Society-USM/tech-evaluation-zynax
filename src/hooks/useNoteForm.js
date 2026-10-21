import { useEffect, useRef, useState } from 'react'

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_IMAGES_PER_NOTE = 8

/**
 * Manages note editor values, queued image changes, client validation, and submission state.
 * Images are only uploaded or removed when the note is saved.
 *
 * @param {{note?: object|null, onSave: Function}} options Editor configuration.
 * @returns {object} Controlled note form state and handlers.
 * @example
 * const form = useNoteForm({ note, onSave })
 */
export function useNoteForm({ note, onSave }) {
  const [values, setValues] = useState({ title: note?.title ?? '', content: note?.content ?? '' })
  const [existingImages, setExistingImages] = useState(note?.images ?? [])
  const [removedImageIds, setRemovedImageIds] = useState([])
  const [newImages, setNewImages] = useState([])
  const [imageError, setImageError] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)
  const previewUrls = useRef(new Set())

  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  /** Updates a controlled editor value. */
  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  /** Queues chosen image files after checking type, size, and the per-note limit. */
  function addImages(fileList) {
    const files = [...fileList]
    const room = MAX_IMAGES_PER_NOTE - existingImages.length - newImages.length
    const invalid = files.find((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES)

    if (invalid) {
      setImageError('Use PNG, JPEG, GIF, or WebP images up to 5 MB.')
      return
    }

    if (files.length > room) {
      setImageError(`A note can hold up to ${MAX_IMAGES_PER_NOTE} images.`)
      return
    }

    setImageError('')
    setNewImages((current) => [...current, ...files.map((file) => {
      const url = URL.createObjectURL(file)
      previewUrls.current.add(url)
      return { file, url }
    })])
  }

  /** Removes a saved image from the editor; it is deleted on save. */
  function removeExistingImage(imageId) {
    setExistingImages((current) => current.filter((image) => image.id !== imageId))
    setRemovedImageIds((current) => [...current, imageId])
  }

  /** Drops a queued image that has not been uploaded yet. */
  function removeNewImage(url) {
    URL.revokeObjectURL(url)
    previewUrls.current.delete(url)
    setNewImages((current) => current.filter((image) => image.url !== url))
  }

  /** Validates and submits the note editor. */
  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      ...(values.title.trim() ? {} : { title: 'Title is required.' }),
      ...(values.content.trim() ? {} : { content: 'Content is required.' }),
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setError('')
    try {
      await onSave({ ...values, newImages: newImages.map((image) => image.file), removedImageIds })
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    values,
    errors,
    error,
    isSubmitting,
    existingImages,
    newImages,
    imageError,
    canAddImages: existingImages.length + newImages.length < MAX_IMAGES_PER_NOTE,
    handleChange,
    handleSubmit,
    addImages,
    removeExistingImage,
    removeNewImage,
  }
}
