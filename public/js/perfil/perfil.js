import {
    inicializarEdicionPerfil,
    configuracionMiembro
} from './editarPerfil.js';

export function inicializarPerfilMiembro(usuario) {
    inicializarEdicionPerfil(usuario, {
        ...configuracionMiembro
    });
}