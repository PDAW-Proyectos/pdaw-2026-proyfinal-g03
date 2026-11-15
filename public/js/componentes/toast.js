export const mostrarToast = (titulo, mensaje, tipo = 'success') => {
    const toastEl = document.getElementById('miToast');
    const toastTitulo = document.getElementById('toast-titulo');
    const toastMensaje = document.getElementById('toast-mensaje');
    const toastIcono = document.getElementById('toast-icono');

    if (!toastEl) {
        alert(`${titulo}: ${mensaje}`);
        return;
    }

    toastTitulo.textContent = titulo;
    toastMensaje.textContent = mensaje;

    if (tipo === 'success') {
        toastIcono.className = 'bi bi-check-circle-fill text-success fs-5';
        toastEl.classList.remove('border-danger');
        toastEl.classList.add('border-start', 'border-4', 'border-success');
    } else {
        toastIcono.className = 'bi bi-exclamation-triangle-fill text-danger fs-5';
        toastEl.classList.remove('border-start', 'border-4', 'border-success');
        toastEl.classList.add('border-danger');
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 4000,
        autohide: true
    });
    toast.show();
};