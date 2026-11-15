import { renderizarPerfil } from '../renderizado-miembro.js';
import { inicializarEdicionPerfil } from './editarPerfil.js';

export function inicializarPerfil(usuario) {
    renderizarPerfil(usuario);
    inicializarEdicionPerfil(usuario);
}
