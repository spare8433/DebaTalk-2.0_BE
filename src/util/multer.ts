import multer from "multer";
import path from "path";
import crypto from "crypto";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const localUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // 이미지 파일의 원본 확장자를 유지한 채로 저장할 디렉토리 경로 생성
      const destinationPath = "./uploads/";
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      // 파일 이름 설정 (확장자 그대로 유지)
      const extension = path.extname(file.originalname);
      crypto.randomBytes(16, function (err, raw) {
        cb(err, err ? "" : raw.toString("hex") + extension);
      });
    },
  }),
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
  region: process.env.S3_REGION,
});

export const S3upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "debatalk-images",
    key(req, file, cb) {
      // 파일 이름 설정 (확장자 그대로 유지)
      const extension = path.extname(file.originalname);
      crypto.randomBytes(16, function (err, raw) {
        cb(err, err ? "" : "original/" + raw.toString("hex") + extension);
      });
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
