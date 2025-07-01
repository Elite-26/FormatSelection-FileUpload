// Global variables
let uploadedFiles = [];
let currentPage = 0;
let thumbnailsPerPage = 5; // Fixed to show exactly 5 files per page
let draggedElement = null;
let selectedFormat = 'pdf'; // Default selected format

// DOM elements
const fileInput = document.getElementById('fileInput');
const dropContainer = document.querySelector('.drop-container');
const uploadBtn = document.querySelector('.upload-btn');
const clearBtn = document.querySelector('.clear-btn');
const downloadAllBtn = document.querySelector('.download-all-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const formatButtons = document.querySelectorAll('.format-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializeButtons();
    initializeFormatSelection();
    updateButtonStates();
    updateNavigationButtons();
});

// Format Selection Functionality
function initializeFormatSelection() {
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            formatButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected format
            selectedFormat = this.dataset.format;
            
            console.log('Selected format:', selectedFormat);
        });
    });
}

// Button Functionality
function initializeButtons() {
    // Upload button
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // Clear button
    clearBtn.addEventListener('click', function() {
        clearAllFiles();
    });

    // Download all button
    downloadAllBtn.addEventListener('click', function() {
        downloadAllFiles();
    });

    // Navigation buttons
    prevBtn.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            updateThumbnailsDisplay();
            updateNavigationButtons();
        }
    });

    nextBtn.addEventListener('click', function() {
        const maxPage = Math.ceil(uploadedFiles.length / thumbnailsPerPage) - 1;
        if (currentPage < maxPage) {
            currentPage++;
            updateThumbnailsDisplay();
            updateNavigationButtons();
        }
    });
}

// File Upload Functionality
function initializeFileUpload() {
    // File input change
    fileInput.addEventListener('change', handleFileSelection);

    // Drag and drop functionality
    dropContainer.addEventListener('dragover', handleDragOver);
    dropContainer.addEventListener('dragleave', handleDragLeave);
    dropContainer.addEventListener('drop', handleDrop);
}

function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

function handleDragOver(event) {
    event.preventDefault();
    dropContainer.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    dropContainer.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    dropContainer.classList.remove('dragover');
    
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
}

function processFiles(files) {
    // Filter files by accepted types
    const acceptedTypes = [
        'image/heic', 'image/heif', 'image/jpeg', 'image/jpg', 
        'video/quicktime', 'video/mp4', 'application/pdf', 
        'image/png', 'image/tiff', 'image/webp'
    ];
    const validFiles = files.filter(file => acceptedTypes.includes(file.type));
    
    if (validFiles.length === 0) {
        return;
    }
    
    // Append new files to existing array instead of replacing
    uploadedFiles = [...uploadedFiles, ...validFiles];
    
    // Reset to first page when new files are added
    currentPage = 0;
    
    // Display file thumbnails
    displayFileThumbnails();
    
    // Update button states
    updateButtonStates();
    updateNavigationButtons();
    
    // Auto-convert files after selection
    setTimeout(() => {
        simulateConversion();
    }, 1000);
}

function updateButtonStates() {
    const hasFiles = uploadedFiles.length > 0;
    clearBtn.disabled = !hasFiles;
    downloadAllBtn.disabled = !hasFiles;
}

function updateNavigationButtons() {
    const maxPage = Math.ceil(uploadedFiles.length / thumbnailsPerPage) - 1;
    
    prevBtn.disabled = currentPage <= 0;
    nextBtn.disabled = currentPage >= maxPage || uploadedFiles.length === 0;
}

function clearAllFiles() {
    uploadedFiles = [];
    currentPage = 0;
    fileInput.value = '';
    displayFileThumbnails();
    updateButtonStates();
    updateNavigationButtons();
}

function downloadAllFiles() {
    if (uploadedFiles.length === 0) {
        return;
    }
    
    // Simulate downloading all files
    uploadedFiles.forEach((file, index) => {
        setTimeout(() => {
            const originalName = file.name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
            const convertedName = `${nameWithoutExt}_converted.${selectedFormat}`;
            downloadFile(convertedName);
        }, index * 500); // Stagger downloads
    });
}

function displayFileThumbnails() {
    // Clear previous display
    const existingThumbnails = document.querySelector('.thumbnails-container');
    if (existingThumbnails) {
        existingThumbnails.remove();
    }
    
    // Hide "Drop Your Files Here" text and dashed border when files are uploaded
    const dropText = dropContainer.querySelector('h3');
    if (dropText) {
        dropText.style.display = uploadedFiles.length > 0 ? 'none' : 'block';
    }
    
    // Hide dashed border when files are uploaded
    if (uploadedFiles.length > 0) {
        dropContainer.style.border = 'none';
    } else {
        dropContainer.style.border = '1px dashed #dee2e6';
    }
    
    if (uploadedFiles.length === 0) return;
    
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails-container';
    
    const thumbnailsWrapper = document.createElement('div');
    thumbnailsWrapper.className = 'thumbnails-wrapper';
    
    uploadedFiles.forEach((file, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'file-thumbnail';
        thumbnail.draggable = true;
        thumbnail.dataset.index = index;
        
        // Add drag event listeners
        thumbnail.addEventListener('dragstart', handleThumbnailDragStart);
        thumbnail.addEventListener('dragover', handleThumbnailDragOver);
        thumbnail.addEventListener('drop', handleThumbnailDrop);
        thumbnail.addEventListener('dragend', handleThumbnailDragEnd);
        
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isPdf = file.type === 'application/pdf';
        const fileName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
        
        // Create header with filename and close button
        const header = document.createElement('div');
        header.className = 'thumbnail-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'thumbnail-filename';
        nameSpan.textContent = fileName;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'thumbnail-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => removeFile(index));
        
        header.appendChild(nameSpan);
        header.appendChild(closeBtn);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'thumbnail-content';
        
        if (isImage) {
            const img = document.createElement('img');
            img.className = 'thumbnail-image';
            img.alt = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            
            content.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'thumbnail-placeholder';
            
            if (isVideo) {
                placeholder.textContent = '🎥';
            } else if (isPdf) {
                placeholder.textContent = '📄';
            } else {
                placeholder.textContent = '📁';
            }
            
            content.appendChild(placeholder);
        }
        
        // Create footer with download button
        const footer = document.createElement('div');
        footer.className = 'thumbnail-footer';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'thumbnail-download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', () => downloadSingleFile(file));
        
        footer.appendChild(downloadBtn);
        
        // Assemble thumbnail
        thumbnail.appendChild(header);
        thumbnail.appendChild(content);
        thumbnail.appendChild(footer);
        
        thumbnailsWrapper.appendChild(thumbnail);
    });
    
    thumbnailsContainer.appendChild(thumbnailsWrapper);
    dropContainer.appendChild(thumbnailsContainer);
    
    updateThumbnailsDisplay();
}

// Drag and Drop Reordering
function handleThumbnailDragStart(event) {
    draggedElement = event.target;
    event.target.style.opacity = '0.5';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target.outerHTML);
}

function handleThumbnailDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    const target = event.target.closest('.file-thumbnail');
    if (target && target !== draggedElement) {
        target.style.border = '2px dashed #007bff';
    }
}

function handleThumbnailDrop(event) {
    event.preventDefault();
    
    const target = event.target.closest('.file-thumbnail');
    if (target && target !== draggedElement) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(target.dataset.index);
        
        // Reorder files array
        const [movedFile] = uploadedFiles.splice(draggedIndex, 1);
        uploadedFiles.splice(targetIndex, 0, movedFile);
        
        // Redisplay thumbnails with new order
        displayFileThumbnails();
    }
}

function handleThumbnailDragEnd(event) {
    event.target.style.opacity = '1';
    
    // Remove all drag indicators
    document.querySelectorAll('.file-thumbnail').forEach(thumb => {
        thumb.style.border = '';
    });
    
    draggedElement = null;
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    displayFileThumbnails();
    updateButtonStates();
    updateNavigationButtons();
}

function downloadSingleFile(file) {
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const convertedName = `${nameWithoutExt}_converted.${selectedFormat}`;
    downloadFile(convertedName);
}

function updateThumbnailsDisplay() {
    const wrapper = document.querySelector('.thumbnails-wrapper');
    if (!wrapper) return;
    
    const startIndex = currentPage * thumbnailsPerPage;
    const endIndex = startIndex + thumbnailsPerPage;
    
    // Show only thumbnails for current page
    const thumbnails = wrapper.querySelectorAll('.file-thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index >= startIndex && index < endIndex) {
            thumbnail.style.display = 'flex';
        } else {
            thumbnail.style.display = 'none';
        }
    });
    
    // Update navigation buttons
    updateNavigationButtons();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function simulateConversion() {
    // Silent conversion - no notifications
}

function downloadFile(filename) {
    // Create a dummy download link for demo purposes
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('This is a demo file: ' + filename);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle window resize for responsive pagination
window.addEventListener('resize', function() {
    if (uploadedFiles.length > 0) {
        updateThumbnailsDisplay();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape to clear selection
    if (event.key === 'Escape') {
        clearAllFiles();
    }
    
    // Arrow keys for navigation
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (!prevBtn.disabled) {
            prevBtn.click();
        }
    }
    
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (!nextBtn.disabled) {
            nextBtn.click();
        }
    }
}); 