    const container = document.getElementById('dropArea'); // Get the container element
    const videoFile = document.getElementById('videoFile');
    const previewVideo = document.getElementById('previewVideo');
    const convertToGifButton = document.getElementById('convertToGif');
    const gifContainer = document.getElementById('gifContainer');
    const progressArea = document.getElementById('progressArea');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const langLinks = document.querySelectorAll('.language-switch a');
    const trimControls = document.getElementById('trimControls');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const videoDurationSpan = document.getElementById('videoDuration');
    const loopGifCheckbox = document.getElementById('loopGif');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fpsInput = document.getElementById('fpsInput');
    const qualitySelect = document.getElementById('qualitySelect');
    const fileNameDisplay = document.getElementById('fileNameDisplay'); // New: File name display
    const errorMessage = document.getElementById('errorMessage'); // New: Error message element
    const themeIcon = document.getElementById('themeIcon'); // New: Theme icon
    const videoUrlInput = document.getElementById('videoUrlInput');
    const loadUrlButton = document.getElementById('loadUrlButton');

    let selectedFile = null;

    // Language translations
    const translations = {
      'zh-TW': {
        orText: '或',
        loadUrlButton: '載入網址',
        invalidUrl: '無效的影片網址',
        loadingUrl: '正在載入網址...',
        urlLoadError: '無法載入影片網址，請確認網址是否正確',
        pageTitle: '影片轉 GIF 轉換器',
        title: '影片轉 GIF 工具',
        description: '上傳一段影片，快速生成高品質 GIF 動畫',
        selectVideoLabel: '選擇影片',
        selectFileButton: '選擇檔案',
        convertToGifButton: '開始轉成 GIF',
        downloadGif: '下載 GIF',
        notVideoFile: '請拖曳一個影片檔案!',
        selectSegmentTitle: '選取影片片段',
        startTimeLabel: '開始時間 (秒):',
        endTimeLabel: '結束時間 (秒):',
        totalDuration: '總時長:',
        invalidTimeRange: '結束時間必須大於開始時間，且不得超過影片總時長。',
        videoError: '無法載入影片檔案，請確認檔案是否損壞或格式不支援。',
        startingConversion: '開始轉換...',
        capturingFrame: '正在擷取影格 {current} / {total}',
        renderingGif: '正在渲染 GIF...',
        conversionComplete: '轉換完成!',
        processingFile: '正在處理檔案...',
        loopGifLabel: '無限迴圈',
        darkModeLabel: '深色模式',
        fpsLabel: '影格率 (FPS):',
        invalidFps: '影格率必須是至少為 1 的有效數字。',
        qualityLabel: '品質:',
        qualityHigh: '高 (檔案較大)',
        qualityMedium: '中 (建議)',
        qualityLow: '低 (檔案較小)',
        dropVideoMessage: '將影片拖曳至此', // New translation
        newConversionButton: '開始新的轉換', // New translation
        corsError: '無法下載影片，因為來源網站未允許跨域存取（CORS）。請下載影片到本機後再上傳，或使用允許跨域的影片網址。'
      },
      'en': {
        orText: 'OR',
        loadUrlButton: 'Load URL',
        invalidUrl: 'Invalid video URL',
        loadingUrl: 'Loading URL...',
        urlLoadError: 'Could not load the video URL, please check if it is correct',
        pageTitle: 'Video to GIF Converter',
        title: 'Video to GIF Tool',
        description: 'Upload a video to quickly generate high-quality GIF animation',
        selectVideoLabel: 'Select Video',
        selectFileButton: 'Choose File',
        convertToGifButton: 'Start Converting to GIF',
        downloadGif: 'Download GIF',
        notVideoFile: 'Please drag and drop a video file!',
        selectSegmentTitle: 'Select Video Segment',
        startTimeLabel: 'Start Time (seconds):',
        endTimeLabel: 'End Time (seconds):',
        totalDuration: 'Total Duration:',
        invalidTimeRange: 'End time must be greater than start time and within the video duration.',
        videoError: 'Could not load the video file. Please check if the file is corrupted or the format is not supported.',
        startingConversion: 'Starting conversion...',
        capturingFrame: 'Capturing frame {current} / {total}',
        renderingGif: 'Rendering GIF...',
        conversionComplete: 'Conversion complete!',
        processingFile: 'Processing file...',
        loopGifLabel: 'Loop infinitely',
        darkModeLabel: 'Dark Mode',
        fpsLabel: 'Frame Rate (FPS):',
        invalidFps: 'Frame rate must be a valid number of at least 1.',
        qualityLabel: 'Quality:',
        qualityHigh: 'High (larger file)',
        qualityMedium: 'Medium (recommended)',
        qualityLow: 'Low (smaller file)',
        dropVideoMessage: 'Drop video here', // New translation
        newConversionButton: 'Start New Conversion', // New translation
        corsError: 'Cannot download video because the source site does not allow cross-origin access (CORS). Please download the video to your computer and upload it, or use a CORS-enabled video URL.'
      }
    };

    // Function to update text based on language
    function updateText(lang) {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          if (element.tagName === 'TITLE') {
             document.title = translations[lang][key];
          } else if (element.tagName === 'OPTION') {
             element.textContent = translations[lang][key];
          } else {
             // For elements that might contain icons, use innerHTML for safety
             if (element.classList.contains('custom-file-upload') || element.classList.contains('btn') || element.classList.contains('download-link')) {
                 const iconSpan = element.querySelector('.icon');
                 element.innerHTML = `${iconSpan ? iconSpan.outerHTML : ''}${translations[lang][key]}`;
             } else {
                 element.textContent = translations[lang][key];
             }
          }
        }
      });

       // Update download link text if it exists (special handling because it's dynamically created)
       const downloadLink = gifContainer.querySelector('.download-link');
       if(downloadLink) {
           const iconSpan = downloadLink.querySelector('.icon');
           downloadLink.innerHTML = `${iconSpan ? iconSpan.outerHTML : ''}${translations[lang]['downloadGif']}`;
       }
        // Update new conversion button text if it exists
       const newConversionButton = gifContainer.querySelector('.btn:last-child'); // Assuming it's the last button
       if(newConversionButton && newConversionButton.textContent !== translations[lang]['newConversionButton']) { // Prevent re-setting if already correct
           newConversionButton.textContent = translations[lang]['newConversionButton'];
       }

        // Update total duration text if displayed
        if (previewVideo.duration && !isNaN(previewVideo.duration)) {
             const duration = previewVideo.duration;
             videoDurationSpan.textContent = `${translations[lang]['totalDuration']} ${formatTime(duration)}`;
        }
         // Update trim controls title explicitly
        const trimTitle = trimControls.querySelector('h3');
        if (trimTitle) { trimTitle.textContent = translations[lang]['selectSegmentTitle']; }
         // Update dark mode label text explicitly
         const darkModeLabel = document.querySelector('.theme-switch label[for="darkModeToggle"]');
         if (darkModeLabel && translations[lang]['darkModeLabel']) { darkModeLabel.textContent = translations[lang]['darkModeLabel']; }
         // Update FPS label text explicitly
         const fpsLabel = trimControls.querySelector('label[for="fpsInput"]');
         if (fpsLabel && translations[lang]['fpsLabel']) { fpsLabel.textContent = translations[lang]['fpsLabel']; }
         // Update Quality label text explicitly
         const qualityLabel = trimControls.querySelector('label[for="qualitySelect"]');
         if (qualityLabel && translations[lang]['qualityLabel']) { qualityLabel.textContent = translations[lang]['qualityLabel']; }

         // Update error message if it's currently displayed
         if (errorMessage.classList.contains('show')) {
             // Re-evaluate its text based on its data-error-key if available, or clear it
             errorMessage.textContent = ''; // Clear for now, specific errors will re-set it.
             errorMessage.classList.remove('show');
         }
    }

     // Function to format time in MM:SS or HH:MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const parts = [];
        if (h > 0) {
            parts.push(h.toString().padStart(2, '0'));
        }
        parts.push(m.toString().padStart(2, '0'));
        parts.push(s.toString().padStart(2, '0'));
        return parts.join(':');
    }

    // --- Error Message Display Functions ---
    function showErrorMessage(messageKey) {
        const currentLang = localStorage.getItem('preferredLang') || 'zh-TW';
        errorMessage.textContent = translations[currentLang][messageKey];
        errorMessage.classList.add('show');
        // Set a timeout to hide the message after a few seconds
        setTimeout(() => {
            hideErrorMessage();
        }, 5000); // Hide after 5 seconds
    }

    function hideErrorMessage() {
        errorMessage.classList.remove('show');
        // Clear text after transition for clean UI
        setTimeout(() => errorMessage.textContent = '', 300);
    }


    // Handle language switch clicks
    langLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        localStorage.setItem('preferredLang', lang); // Save preference
        updateText(lang);
        langLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Set initial language on load
    const initialLang = localStorage.getItem('preferredLang') || 'zh-TW';
    updateText(initialLang);
    langLinks.forEach(link => {
        if (link.getAttribute('data-lang') === initialLang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Dark Mode Functionality ---
    function enableDarkMode() {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '🌙'; // Moon icon
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '☀️'; // Sun icon
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
        darkModeToggle.checked = true;
    } else {
        disableDarkMode();
        darkModeToggle.checked = false; // Ensure toggle is off for light mode
    }

    // Listen for theme toggle changes
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });


    // --- Drag and Drop Functionality ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        container.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        container.classList.add('dragover');
    }

    function unhighlight() {
        container.classList.remove('dragover');
    }

    // Handle dropped files
    container.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('video/')) {
                 processFile(file);
                 hideErrorMessage(); // Clear any previous error
            } else {
                 showErrorMessage('notVideoFile'); // Use translated error message
            }
        }
    }

    // Function to reset UI to initial state
    function resetUI() {
        previewVideo.style.display = 'none';
        previewVideo.src = ''; // Clear video source
        convertToGifButton.style.display = 'none'; // Hide convert button
        gifContainer.innerHTML = ''; // Clear GIF and download button
        trimControls.style.display = 'none'; // Hide trim controls
        fileNameDisplay.textContent = ''; // Clear filename display
        selectedFile = null; // Clear selected file
        hideErrorMessage(); // Clear any existing error messages
        progressArea.style.display = 'none'; // Ensure progress area is hidden
        progressBar.style.width = '0%';
        progressText.textContent = '';
        startTimeInput.value = 0; // Reset trim controls
        endTimeInput.value = 0;
        videoDurationSpan.textContent = '';
        fpsInput.value = 15; // Reset FPS to default
        qualitySelect.value = 20; // Reset quality to medium
        loopGifCheckbox.checked = true; // Reset loop to default
    }


    // Function to process the selected/dropped file
    function processFile(file) {
        selectedFile = file;
        const reader = new FileReader();

        const currentLang = localStorage.getItem('preferredLang') || 'zh-TW';
        progressArea.style.display = 'flex'; // Show progress area
        progressBar.style.width = '0%';
        progressText.textContent = translations[currentLang]['processingFile'];
        hideErrorMessage(); // Clear any previous error

        reader.onload = function(e) {
          previewVideo.src = e.target.result;
          previewVideo.style.display = 'block';
          convertToGifButton.style.display = 'block';
          gifContainer.innerHTML = ''; // Clear previous GIF
          trimControls.style.display = 'block'; // Show trim controls

          // Reset time inputs and duration display
          startTimeInput.value = 0;
          endTimeInput.value = 0;
          videoDurationSpan.textContent = ''; // Clear previous duration

          fileNameDisplay.textContent = file.name; // Display the file name

          // Hide processing text and progress bar until conversion starts
          progressArea.style.display = 'none';
          progressText.textContent = '';
        };
         reader.onerror = function() {
             showErrorMessage('videoError'); // Use translated error message
             // Hide progress on error
             progressArea.style.display = 'none';
             progressText.textContent = '';
             resetUI(); // Reset UI on severe error
         }
        reader.readAsDataURL(file);
    }

    // --- Handle file selection via the hidden input ---
    videoFile.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        processFile(file);
      }
    });

    // --- Update time inputs and duration when video metadata is loaded ---
    previewVideo.addEventListener('loadedmetadata', function() {
        const duration = previewVideo.duration;
        endTimeInput.value = duration.toFixed(2); // Set default end time to total duration
        endTimeInput.max = duration.toFixed(2); // Set max for end time input
        startTimeInput.max = duration.toFixed(2); // Set max for start time input

        const currentLang = localStorage.getItem('preferredLang') || 'zh-TW';
        videoDurationSpan.textContent = `${translations[currentLang]['totalDuration']} ${formatTime(duration)}`; // Display total duration

        // Add event listeners to time inputs to update video preview on change
        startTimeInput.addEventListener('input', updateVideoTime);
        endTimeInput.addEventListener('input', updateVideoTime);
    });

    // Function to update video preview time based on input values
    function updateVideoTime() {
        const startTime = parseFloat(startTimeInput.value);
        const endTime = parseFloat(endTimeInput.value);
        const duration = previewVideo.duration;

         // Basic validation - prevent seeking if invalid
        if (isNaN(startTime) || startTime < 0 || startTime > duration) { return; }
        if (isNaN(endTime) || endTime < 0 || endTime > duration) { return; }
        if (startTime >= endTime && endTime > 0) { return; } // Don't alert here, just prevent seeking
        
        // Seek to the start time when start time input changes or on load
        if (document.activeElement === startTimeInput || !document.activeElement) {
             previewVideo.currentTime = startTime;
        }
    }


    // --- Existing GIF Conversion Functionality ---
    convertToGifButton.addEventListener('click', function() {
      // Allow conversion if a video is loaded (either file or URL)
      if (!previewVideo.src || previewVideo.readyState < 2) {
        showErrorMessage('videoError');
        return;
      }

      const startTime = parseFloat(startTimeInput.value);
      const endTime = parseFloat(endTimeInput.value);
      const duration = previewVideo.duration;
      const loopGif = loopGifCheckbox.checked;
      const framesPerSecond = parseInt(fpsInput.value, 10);
      const gifQuality = parseInt(qualitySelect.value, 10);

      // Validate time inputs before starting conversion
      if (isNaN(startTime) || isNaN(endTime) || startTime < 0 || endTime < 0 || startTime >= endTime || endTime > duration) {
          showErrorMessage('invalidTimeRange');
          return;
      }

      // Validate FPS input
      if (isNaN(framesPerSecond) || framesPerSecond < 1) {
          showErrorMessage('invalidFps');
          return;
      }

      hideErrorMessage(); // Clear any previous errors if validation passes

      const currentLang = localStorage.getItem('preferredLang') || 'zh-TW';
      convertToGifButton.disabled = true;
      progressArea.style.display = 'flex';
      progressBar.style.width = '0%';
      progressText.textContent = translations[currentLang]['startingConversion'];
      gifContainer.innerHTML = ''; // Clear previous GIF

      function generateGif() {
        const gif = new GIF({
          width: previewVideo.videoWidth,
          height: previewVideo.videoHeight,
          workers: 4,
          quality: gifQuality,
          workerScript: './gif.worker.js',
          repeat: loopGif ? 0 : -1
        });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = previewVideo.videoWidth;
        canvas.height = previewVideo.videoHeight;

        const segmentDuration = endTime - startTime;
        let frameCount = Math.max(2, Math.floor(segmentDuration * framesPerSecond));
        const interval = segmentDuration / frameCount;

        let captured = 0;

        function captureFrame(idx) {
          let timeToSeek = startTime + idx * interval;
          if (idx === frameCount - 1) {
               timeToSeek = endTime;
          }
          timeToSeek = Math.min(timeToSeek, endTime);

          previewVideo.currentTime = timeToSeek;
          previewVideo.pause();

          const onSeeked = function() {
            previewVideo.removeEventListener('seeked', onSeeked);
            context.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
            gif.addFrame(context, { copy: true, delay: (1000 / framesPerSecond) });

            captured++;
            const captureProgress = (captured / frameCount) * 80;
            progressBar.style.width = captureProgress + "%";

            progressText.textContent = translations[currentLang]['capturingFrame']
                                        .replace('{current}', captured)
                                        .replace('{total}', frameCount);

            if (captured < frameCount) {
              setTimeout(()=>captureFrame(captured), 50);
            } else {
               progressBar.style.width = "80%";
               progressText.textContent = translations[currentLang]['renderingGif'];
              gif.render();
            }
          };

          previewVideo.addEventListener('seeked', onSeeked);
           if (Math.abs(previewVideo.currentTime - timeToSeek) < 0.1) {
               onSeeked();
           }
        }

        gif.on('progress', function(p) {
          progressBar.style.width = (80 + p*20) + "%"
        });

        gif.on('finished', function(blob) {
          progressBar.style.width = "100%";
          progressText.textContent = translations[currentLang]['conversionComplete'];

          setTimeout(()=>{
            progressArea.style.display = 'none';
            progressBar.style.width = "0%";
            progressText.textContent = '';
            convertToGifButton.disabled = false;
          }, 700);

          const url = URL.createObjectURL(blob);
          const img = document.createElement('img');
          img.src = url;
          img.alt = "Generated GIF"; // Alt text for accessibility

          const download = document.createElement('a');
          download.href = url;
          download.download = "output.gif";
          download.innerHTML = `<span class="icon">⬇️</span> ${translations[currentLang]['downloadGif']}`;
          download.className = "download-link";

          const newConversionBtn = document.createElement('button');
          newConversionBtn.textContent = translations[currentLang]['newConversionButton'];
          newConversionBtn.className = "btn"; // Reuse existing button style
          newConversionBtn.style.marginTop = '15px'; // Space from download link
          newConversionBtn.addEventListener('click', resetUI); // Attach reset function

          gifContainer.innerHTML = ''; // Clear previous output
          gifContainer.appendChild(img);
          gifContainer.appendChild(download);
          gifContainer.appendChild(newConversionBtn); // Add the new button
        });

        // Start capturing frames
        captureFrame(0);
      }

      // Wait for video metadata to load
      if (previewVideo.readyState >= 2) {
        generateGif();
      } else {
        previewVideo.addEventListener('loadedmetadata', function onMetadataLoaded() {
          previewVideo.removeEventListener('loadedmetadata', onMetadataLoaded);
          generateGif();
        });
        previewVideo.addEventListener('error', function onVideoError() {
            previewVideo.removeEventListener('error', onVideoError);
            showErrorMessage('videoError');
            convertToGifButton.disabled = false;
            progressArea.style.display = 'none';
            progressText.textContent = '';
        });
      }
    });
    
    // --- Load video from URL functionality ---
    loadUrlButton.addEventListener('click', async function() {
      const url = videoUrlInput.value.trim();
      const currentLang = localStorage.getItem('preferredLang') || 'zh-TW';
      if (!url || !/^https?:\/\/.+/i.test(url)) {
        showErrorMessage('invalidUrl');
        return;
      }
      resetUI();
      progressArea.style.display = 'flex';
      progressBar.style.width = '0%';
      progressText.textContent = translations[currentLang]['loadingUrl'];
      fileNameDisplay.textContent = url;
      selectedFile = null;
      try {
        // Use cors-anywhere proxy
        const corsProxy = 'https://odd-dream-5e6e.anthorytsang.workers.dev/?url=';
        const proxyUrl = corsProxy + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('fetch failed');
        // Check CORS
        if (response.type === "opaque") {
          throw new Error('cors');
        }
        const blob = await response.blob();
        selectedFile = new File([blob], url.split('/').pop() || 'video-from-url', { type: blob.type });
        const objectUrl = URL.createObjectURL(blob);
        previewVideo.src = objectUrl;
        previewVideo.style.display = 'block';
        function onLoaded() {
          progressArea.style.display = 'none';
          progressText.textContent = '';
          convertToGifButton.style.display = 'block';
          trimControls.style.display = 'block';
          videoUrlInput.value = '';
          previewVideo.removeEventListener('loadedmetadata', onLoaded);
          previewVideo.removeEventListener('error', onError);
        }
        function onError() {
          showErrorMessage('urlLoadError');
          progressArea.style.display = 'none';
          progressText.textContent = '';
          previewVideo.style.display = 'none';
          fileNameDisplay.textContent = '';
          previewVideo.removeEventListener('loadedmetadata', onLoaded);
          previewVideo.removeEventListener('error', onError);
          URL.revokeObjectURL(objectUrl);
        }
        previewVideo.addEventListener('loadedmetadata', onLoaded);
        previewVideo.addEventListener('error', onError);
      } catch (e) {
        if (e.message === 'cors') {
          showErrorMessage('corsError');
        } else {
          showErrorMessage('urlLoadError');
        }
        progressArea.style.display = 'none';
        progressText.textContent = '';
        previewVideo.style.display = 'none';
        fileNameDisplay.textContent = '';
      }
    });

    // Allow pressing Enter in the URL input to trigger loading
    videoUrlInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        loadUrlButton.click();
      }
    });
    