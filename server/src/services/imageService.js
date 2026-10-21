import { randomUUID } from 'node:crypto'
import { mkdir, open, rm } from 'node:fs/promises'
import path from 'node:path'
import { getEnv } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'

/** Image formats accepted for note attachments, keyed by MIME type. */
export const IMAGE_TYPES = {
  'image/png': { extension: '.png', matches: (bytes) => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/jpeg': { extension: '.jpg', matches: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  'image/gif': { extension: '.gif', matches: (bytes) => bytes.subarray(0, 4).toString('ascii') === 'GIF8' },
  'image/webp': { extension: '.webp', matches: (bytes) => bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP' },
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_IMAGES_PER_NOTE = 8

/**
 * Ensures the upload directory exists and returns its absolute path.
 *
 * @returns {Promise<string>} Absolute upload directory.
 * @example
 * const directory = await ensureUploadDir()
 */
export async function ensureUploadDir() {
  const { uploadDir } = getEnv()
  await mkdir(uploadDir, { recursive: true })
  return uploadDir
}

/**
 * Builds a random, collision-free file name for an uploaded image.
 *
 * @param {string} mimeType Accepted image MIME type.
 * @returns {string} Stored file name.
 * @example
 * createStoredFileName('image/png') // "3f1c9a2e-….png"
 */
export function createStoredFileName(mimeType) {
  return `${randomUUID()}${IMAGE_TYPES[mimeType].extension}`
}

/**
 * Resolves a stored file name inside the upload directory, rejecting path traversal.
 *
 * @param {string} fileName Stored file name.
 * @returns {string} Absolute file path.
 * @example
 * response.sendFile(resolveStoredImage(image.fileName))
 */
export function resolveStoredImage(fileName) {
  const { uploadDir } = getEnv()
  const filePath = path.resolve(uploadDir, fileName)

  if (path.dirname(filePath) !== uploadDir) {
    throw new AppError(400, 'Invalid image path.')
  }

  return filePath
}

/**
 * Deletes stored image files, ignoring files that are already gone.
 *
 * @param {string[]} fileNames Stored file names.
 * @returns {Promise<void>}
 * @example
 * await removeStoredImages(['a.png'])
 */
export async function removeStoredImages(fileNames) {
  await Promise.all(fileNames.map((fileName) => rm(resolveStoredImage(fileName), { force: true })))
}

/**
 * Confirms the uploaded file's leading bytes match its declared image type.
 *
 * @param {string} filePath Uploaded file path.
 * @param {string} mimeType Declared MIME type.
 * @returns {Promise<boolean>} Whether the file signature matches.
 * @example
 * await hasImageSignature(file.path, file.mimetype)
 */
async function hasImageSignature(filePath, mimeType) {
  const handle = await open(filePath, 'r')
  try {
    const bytes = Buffer.alloc(12)
    await handle.read(bytes, 0, 12, 0)
    return IMAGE_TYPES[mimeType]?.matches(bytes) ?? false
  } finally {
    await handle.close()
  }
}

/**
 * Attaches an uploaded image to a note owned by the user. The upload is removed if any check fails.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @param {{filename: string, path: string, mimetype: string, size: number}} file File stored by multer.
 * @returns {Promise<{id: string, url: string}>} Public image reference.
 * @example
 * const image = await addImageToNote(userId, noteId, request.file)
 */
export async function addImageToNote(ownerId, noteId, file) {
  try {
    const note = await prisma.note.findFirst({ where: { id: noteId, ownerId }, select: { id: true, _count: { select: { images: true } } } })

    if (!note) throw new AppError(404, 'Note not found.')
    if (note._count.images >= MAX_IMAGES_PER_NOTE) throw new AppError(400, `A note can hold up to ${MAX_IMAGES_PER_NOTE} images.`)
    if (!(await hasImageSignature(file.path, file.mimetype))) throw new AppError(400, 'The file is not a valid image.')

    const image = await prisma.noteImage.create({ data: { noteId, fileName: file.filename, mimeType: file.mimetype, size: file.size } })
    await prisma.note.update({ where: { id: noteId }, data: { updatedAt: new Date() } })
    return { id: image.id, url: `/api/v1/notes/${noteId}/images/${image.id}` }
  } catch (error) {
    await rm(file.path, { force: true })
    throw error
  }
}

/**
 * Finds an image that belongs to a note owned by the user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @param {string} imageId Image identifier.
 * @returns {Promise<object>} Image record.
 * @throws {AppError} 404 when the image is missing or owned by someone else.
 * @example
 * const image = await findOwnedImage(userId, noteId, imageId)
 */
export async function findOwnedImage(ownerId, noteId, imageId) {
  const image = await prisma.noteImage.findFirst({ where: { id: imageId, noteId, note: { ownerId } } })

  if (!image) {
    throw new AppError(404, 'Image not found.')
  }

  return image
}

/**
 * Deletes one image from a note owned by the user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @param {string} imageId Image identifier.
 * @returns {Promise<void>}
 * @example
 * await deleteImageFromNote(userId, noteId, imageId)
 */
export async function deleteImageFromNote(ownerId, noteId, imageId) {
  const image = await findOwnedImage(ownerId, noteId, imageId)
  await prisma.noteImage.delete({ where: { id: image.id } })
  await removeStoredImages([image.fileName])
}
