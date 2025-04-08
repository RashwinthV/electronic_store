const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../config/googleApi.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
 
const drive = google.drive({ version: 'v3', auth });
const upload = multer({ dest: 'uploads/' });

exports.useruploadImage = async (req, res) => {
  try {
    
    const fileMetadata = {
      parents: [process.env.USER_GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    fs.unlinkSync(req.file.path);

    res.json({ success: true, url: `https://drive.google.com/uc?export=view&id=${file.data.id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};

exports.upload = upload.single('file');
