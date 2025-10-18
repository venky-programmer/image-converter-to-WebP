class ImageConverter {
    constructor() {
        this.selectedFiles = [];
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');
        this.convertBtn = document.getElementById('convertBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.results = document.getElementById('results');
        this.resultsList = document.getElementById('resultsList');
    }

    setupEventListeners() {
        // File input events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Quality slider
        this.qualitySlider.addEventListener('input', (e) => {
            this.qualityValue.textContent = e.target.value;
        });

        // Convert button
        this.convertBtn.addEventListener('click', () => this.convertImages());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        this.handleFileSelect(e.dataTransfer.files);
    }

    handleFileSelect(files) {
        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            return validTypes.includes(file.type);
        });

        if (validFiles.length === 0) {
            alert('Please select valid image files (PNG, JPG, JPEG)');
            return;
        }

        this.selectedFiles = [...this.selectedFiles, ...validFiles];
        this.updateFileList();
        this.updateConvertButton();
    }

    updateFileList() {
        const fileListContainer = document.querySelector('.file-list') || this.createFileListContainer();
        
        fileListContainer.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = this.formatFileSize(file.size);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => this.removeFile(index));
            
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileItem.appendChild(removeBtn);
            
            fileListContainer.appendChild(fileItem);
        });
    }

    createFileListContainer() {
        const container = document.createElement('div');
        container.className = 'file-list';
        this.uploadArea.appendChild(container);
        return container;
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
        this.updateConvertButton();
    }

    updateConvertButton() {
        this.convertBtn.disabled = this.selectedFiles.length === 0;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async convertImages() {
        if (this.selectedFiles.length === 0) return;

        this.showProgress();
        this.results.style.display = 'none';
        this.resultsList.innerHTML = '';

        const quality = parseInt(this.qualitySlider.value) / 100;
        const convertedFiles = [];

        for (let i = 0; i < this.selectedFiles.length; i++) {
            const file = this.selectedFiles[i];
            this.updateProgress((i / this.selectedFiles.length) * 100, `Converting ${file.name}...`);

            try {
                const convertedBlob = await this.convertToWebP(file, quality);
                const convertedFile = new File([convertedBlob], this.getWebPFileName(file.name), {
                    type: 'image/webp'
                });
                convertedFiles.push({
                    original: file,
                    converted: convertedFile,
                    originalSize: file.size,
                    convertedSize: convertedFile.size
                });
            } catch (error) {
                console.error(`Error converting ${file.name}:`, error);
            }
        }

        this.updateProgress(100, 'Conversion complete!');
        this.showResults(convertedFiles);
    }

    convertToWebP(file, quality) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image'));
                    }
                }, 'image/webp', quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    getWebPFileName(originalName) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        return `${nameWithoutExt}.webp`;
    }

    showProgress() {
        this.progressContainer.style.display = 'block';
        this.convertBtn.disabled = true;
    }

    updateProgress(percentage, text) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }

    showResults(convertedFiles) {
        this.progressContainer.style.display = 'none';
        this.results.style.display = 'block';
        this.convertBtn.disabled = false;

        convertedFiles.forEach(({ original, converted, originalSize, convertedSize }) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const compressionRatio = ((originalSize - convertedSize) / originalSize * 100).toFixed(1);
            
            const resultInfo = document.createElement('div');
            resultInfo.className = 'result-info';
            
            const resultName = document.createElement('div');
            resultName.className = 'result-name';
            resultName.textContent = converted.name;
            
            const resultSize = document.createElement('div');
            resultSize.className = 'result-size';
            resultSize.textContent = `${this.formatFileSize(originalSize)} → ${this.formatFileSize(convertedSize)} (${compressionRatio}% smaller)`;
            
            resultInfo.appendChild(resultName);
            resultInfo.appendChild(resultSize);
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'Download';
            downloadBtn.addEventListener('click', () => this.downloadFile(converted.name, converted.type));
            
            resultItem.appendChild(resultInfo);
            resultItem.appendChild(downloadBtn);
            
            this.resultsList.appendChild(resultItem);
        });

        // Store converted files for download
        this.convertedFiles = convertedFiles;
    }

    downloadFile(fileName, fileType) {
        const fileData = this.convertedFiles.find(f => f.converted.name === fileName);
        if (!fileData) return;

        const url = URL.createObjectURL(fileData.converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the converter when the popup loads
let imageConverter;
document.addEventListener('DOMContentLoaded', () => {
    imageConverter = new ImageConverter();
});
