const { createUploadStream } = require('./')
const ghostscript = require('../ghostscript')

const createThumbnail = ({ pdfPath, thumbnailPath }) => ghostscript('thumbnail', {
  source: pdfPath,
  dest: thumbnailPath
})

module.exports = async (state, errors) => {
  try {
    await createThumbnail(state)
  } catch (error) {
    console.log('createThumbnail', error)
    errors.push({ message: error.toString() })
  }

  try {
    await createUploadStream(state.thumbnailPath, {
      key: `${state.objectPrefix}/thumbnail.jpg`,
      tagging: `sub=${state.sub}&skipProcessing=true`
    })
  } catch (error) {
    errors.push({ message: error.toString() })
  }
}
