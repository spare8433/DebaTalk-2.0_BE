import multer from "multer";

export const upload = multer({ 
  dest: __dirname + '/uploads/', // 이미지 업로드 경로
}) 