/**
 * FastFund - Dashboard Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initFileUpload();
});

function initFileUpload() {
  const uploadForm = document.getElementById('docUploadForm');
  if (!uploadForm) return;

  const fileInput = document.getElementById('documentFile');
  const fileError = document.getElementById('fileError');
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

  fileInput.addEventListener('change', function() {
    fileError.style.display = 'none';
    const file = this.files[0];
    
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        showFileError('Invalid file type. Please upload a PDF, JPG, or PNG.');
        this.value = '';
        return;
      }
      if (file.size > maxFileSize) {
        showFileError('File size exceeds 5MB limit.');
        this.value = '';
        return;
      }
    }
  });

  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fileInput.files.length) {
      showFileError('Please select a file to upload.');
      return;
    }

    const btn = uploadForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Uploading...';
    btn.disabled = true;

    // Simulate upload delay
    setTimeout(() => {
      btn.innerHTML = '<i class="ph ph-check-circle"></i> Uploaded Successfully';
      btn.classList.replace('btn-primary', 'btn-success');
      fileInput.value = '';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.replace('btn-success', 'btn-primary');
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

function showFileError(msg) {
  const fileError = document.getElementById('fileError');
  fileError.textContent = msg;
  fileError.style.display = 'block';
}
