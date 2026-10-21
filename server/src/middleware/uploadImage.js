import multer from 'multer'
import { createStoredFileName, ensureUploadDir, IMAGE_TYPES, MAX_IMAGE_BYTES } from '../services/imageService.js'
import { AppError } from '../utils/appError.js'

const upload = multer({
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => {
      ensureUploadDir().then((directory) => callback(null, directory), callback)
    },
    filename: (_request, file, callback) => callback(null, createStoredFileName(file.mimetype)),
  }),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (IMAGE_TYPES[file.mimetype]) callback(null, true)
    else callback(new AppError(400, 'Only PNG, JPEG, GIF, or WebP images are allowed.'))
  },
}).single('image')

/**
 * Accepts one image upload in the `image` multipart field and converts multer errors into API errors.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.post('/:noteId/images', uploadImage, addImage)
 */
export function uploadImage(request, response, next) {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE' ? 'Images must be 5 MB or smaller.' : 'The image upload could not be processed.'
      next(new AppError(400, message))
      return
    }

    if (error) {
      next(error)
      return
    }

    if (!request.file) {
      next(new AppError(400, 'Choose an image to upload.'))
      return
    }

    next()
  })
}
