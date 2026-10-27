import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { extname } from 'path';
import { AdminGuard } from '../auth/admin.guard';

// Extensiones de imagen que se aceptan
const EXTENSIONES = ['.jpg', '.jpeg', '.png', '.webp'];

// Solo deja pasar imágenes
function soloImagenes(peticion: any, archivo: any, listo: any) {
  const extension = extname(archivo.originalname).toLowerCase();
  if (EXTENSIONES.includes(extension)) {
    listo(null, true);
  } else {
    listo(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP'), false);
  }
}

@Controller('upload')
export class UploadController {
  // =====================================
  // POST /upload - SUBIR FOTO A CLOUDINARY (solo administrador)
  // =====================================

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      fileFilter: soloImagenes,
      limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 MB
    }),
  )
  async subirFoto(@UploadedFile() archivo: Express.Multer.File) {
    if (!archivo) {
      throw new BadRequestException('Debe enviar una imagen en el campo "foto"');
    }

    // datos de la cuenta de Cloudinary (vienen de las variables de entorno)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NOMBRE,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // la imagen llega en memoria; se convierte a texto (base64) para enviarla a Cloudinary
    const imagen = 'data:' + archivo.mimetype + ';base64,' + archivo.buffer.toString('base64');

    try {
      const resultado = await cloudinary.uploader.upload(imagen, {
        folder: 'artesanias-guapinol',
      });

      // se devuelve la dirección de la foto para guardarla en el producto
      return { foto: resultado.secure_url };
    } catch (error) {
      throw new BadRequestException('No se pudo subir la imagen a Cloudinary');
    }
  }
}
