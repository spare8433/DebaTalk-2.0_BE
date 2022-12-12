import multer from "multer";

export const upload = multer({ 
  dest: 'C:/project/DebaTalk-2.0/DebaTalk-2.0_back/uploads', // 이미지 업로드 경로
}) 